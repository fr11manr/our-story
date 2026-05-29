import { randomUUID } from "node:crypto";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { MemoryCategory, PhotoMemory } from "@/data/memories";
import { ADMIN_SESSION_COOKIE, SESSION_VALUE } from "@/lib/auth";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

type InsertableTable = {
  insert(value: unknown): {
    select(columns?: string): {
      single(): PromiseLike<{ data: unknown; error: { message: string; code?: string; details?: string } | null }>;
    };
  };
};

function textValue(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function extensionFor(file: File) {
  const ext = path.extname(file.name);
  if (ext) return ext;
  if (file.type.includes("png")) return ".png";
  if (file.type.includes("webp")) return ".webp";
  if (file.type.includes("gif")) return ".gif";
  if (file.type.includes("mp4")) return ".mp4";
  if (file.type.includes("quicktime")) return ".mov";
  return ".jpg";
}

async function uploadFile(file: File | null, bucket: "photos" | "videos", prefix: string) {
  if (!file || file.size === 0) return null;

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const filePath = `${prefix}/${randomUUID()}${extensionFor(file)}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}

export async function POST(request: Request) {
  try {
    console.log("[api/uploads] request received");

    const cookieStore = await cookies();
    if (cookieStore.get(ADMIN_SESSION_COOKIE)?.value !== SESSION_VALUE) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { ok: false, message: "Cloud archive is not ready yet." },
        { status: 503 },
      );
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, message: "Cloud archive is not ready yet." }, { status: 503 });
    }

    const formData = await request.formData();
    const type = textValue(formData, "type", textValue(formData, "kind", "photo"));
    const title = textValue(formData, "title", type === "video" ? "Untitled Video" : "Untitled Photo");
    const date = textValue(formData, "date", new Date().toISOString().slice(0, 10));
    const category = textValue(formData, "category", "Favorite Moments") as MemoryCategory;
    const description = textValue(formData, "description", "一段新的回忆。");
    const featured = textValue(formData, "featured", "false") === "true";

    console.log("[api/uploads] form type:", type);

    if (type === "video") {
      const videoValue = formData.get("video");
      const uploadedVideo = await uploadFile(videoValue instanceof File ? videoValue : null, "videos", "memories");

      if (!uploadedVideo) {
        return NextResponse.json({ ok: false, message: "Please choose a video file." }, { status: 400 });
      }

      console.log("[api/uploads] uploaded storage path:", uploadedVideo.path);
      console.log("[api/uploads] public video URL:", uploadedVideo.publicUrl);

      const videoPayload = {
        title,
        date,
        category,
        description,
        video_src: uploadedVideo.publicUrl,
        external_url: null,
        featured,
      };

      const videosTable = supabase.from("videos") as unknown as InsertableTable;
      let insertResult = await videosTable.insert(videoPayload).select("*").single();

      if (insertResult.error?.message.toLowerCase().includes("cover")) {
        console.log("[api/uploads] database insert result:", insertResult);
        console.log("[api/uploads] retrying insert with legacy cover default");
        insertResult = await videosTable.insert({ ...videoPayload, cover: "" }).select("*").single();
      }

      console.log("[api/uploads] database insert result:", insertResult);

      if (insertResult.error) {
        return NextResponse.json({ ok: false, message: insertResult.error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, item: insertResult.data, videoUrl: uploadedVideo.publicUrl });
    }

    const photoValue = formData.get("photo");
    const uploadedPhoto = await uploadFile(photoValue instanceof File ? photoValue : null, "photos", "memories");
    const height = textValue(formData, "height", "medium") as PhotoMemory["height"];

    const photosTable = supabase.from("photos") as unknown as InsertableTable;
    const insertResult = await photosTable.insert({
      title,
      date,
      category,
      description,
      featured,
      src: uploadedPhoto?.publicUrl || "/photos/gallery-1.svg",
      height,
    }).select("*").single();

    console.log("[api/uploads] uploaded storage path:", uploadedPhoto?.path ?? "none");
    console.log("[api/uploads] public photo URL:", uploadedPhoto?.publicUrl ?? "none");
    console.log("[api/uploads] database insert result:", insertResult);

    if (insertResult.error) {
      return NextResponse.json({ ok: false, message: insertResult.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, item: insertResult.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("[api/uploads] upload failed:", error);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
