import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  homeImages,
  letters,
  photos,
  secretCards,
  specialDates,
  storyAssets,
  storyChapters,
  timeline,
  videos,
} from "@/data/memories";
import { SESSION_VALUE, SITE_SESSION_COOKIE } from "@/lib/auth";
import { createSupabaseBrowserClient, isSupabaseConfigured, photoFromRow, timelineFromRow, videoFromRow } from "@/lib/supabase";

type Row = Record<string, unknown>;

function byPinnedSortDate(a: Row, b: Row) {
  const pinned = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
  if (pinned) return pinned;
  const sort = Number(a.sort_order ?? 9999) - Number(b.sort_order ?? 9999);
  if (sort) return sort;
  return String(b.date ?? b.created_at ?? "").localeCompare(String(a.date ?? a.created_at ?? ""));
}

function camelItem(row: Row) {
  return {
    ...row,
    sortOrder: row.sort_order,
    videoSrc: row.video_src,
    externalUrl: row.external_url,
    from: row.author ?? row.from,
    body: row.content ?? row.body,
    note: row.label ?? row.note,
  };
}

async function readTable(supabase: NonNullable<ReturnType<typeof createSupabaseBrowserClient>>, table: string) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) return [];
  return (data as Row[]).sort(byPinnedSortDate).map(camelItem);
}

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(SITE_SESSION_COOKIE)?.value !== SESSION_VALUE) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      photos,
      videos,
      timeline,
      letters,
      specialDates,
      secretCards,
      homeImages,
      storyChapters,
      storyAssets,
      source: "default",
    });
  }

  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({
      photos,
      videos,
      timeline,
      letters,
      specialDates,
      secretCards,
      homeImages,
      storyChapters,
      storyAssets,
      source: "default",
    });
  }

  const [photoResult, videoResult, timelineResult, cloudLetters, cloudDates, cloudSecret, cloudHome, cloudStoryChapters, cloudStoryAssets] = await Promise.all([
    supabase.from("photos").select("*").order("date", { ascending: false }),
    supabase.from("videos").select("*").order("date", { ascending: false }),
    supabase.from("timeline").select("*").order("date", { ascending: false }),
    readTable(supabase, "letters"),
    readTable(supabase, "special_dates"),
    readTable(supabase, "secret_cards"),
    readTable(supabase, "home_images"),
    readTable(supabase, "story_chapters"),
    readTable(supabase, "story_assets"),
  ]);

  return NextResponse.json({
    photos: photoResult.data?.length ? [...photoResult.data].sort(byPinnedSortDate).map(photoFromRow) : photos,
    videos: videoResult.data?.length ? [...videoResult.data].sort(byPinnedSortDate).map(videoFromRow) : videos,
    timeline: timelineResult.data?.length ? [...timelineResult.data].sort(byPinnedSortDate).map(timelineFromRow) : timeline,
    letters: cloudLetters.length ? cloudLetters : letters,
    specialDates: cloudDates.length ? cloudDates : specialDates,
    secretCards: cloudSecret.length ? cloudSecret : secretCards,
    homeImages: cloudHome.length ? cloudHome : homeImages,
    storyChapters: cloudStoryChapters.length ? cloudStoryChapters : storyChapters,
    storyAssets: cloudStoryAssets.length ? cloudStoryAssets : storyAssets,
    source: "supabase",
  });
}
