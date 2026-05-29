import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { photos, timeline, videos } from "@/data/memories";
import { SESSION_VALUE, SITE_SESSION_COOKIE } from "@/lib/auth";
import { createSupabaseBrowserClient, isSupabaseConfigured, photoFromRow, timelineFromRow, videoFromRow } from "@/lib/supabase";

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(SITE_SESSION_COOKIE)?.value !== SESSION_VALUE) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ photos, videos, timeline, source: "default" });
  }

  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({ photos, videos, timeline, source: "default" });
  }

  const [photoResult, videoResult, timelineResult] = await Promise.all([
    supabase.from("photos").select("*").order("date", { ascending: false }),
    supabase.from("videos").select("*").order("date", { ascending: false }),
    supabase.from("timeline").select("*").order("date", { ascending: false }),
  ]);

  return NextResponse.json({
    photos: photoResult.data?.map(photoFromRow) ?? photos,
    videos: videoResult.data?.map(videoFromRow) ?? videos,
    timeline: timelineResult.data?.map(timelineFromRow) ?? timeline,
    source: "supabase",
  });
}
