import { randomUUID } from "node:crypto";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_VALUE } from "@/lib/auth";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

type AnyTable = {
  select(columns?: string): { order(column: string, options?: { ascending?: boolean }): PromiseLike<{ data: unknown[] | null; error: DbError | null }> };
  insert(value: unknown): { select(columns?: string): { single(): PromiseLike<{ data: unknown; error: DbError | null }> } };
  update(value: unknown): { eq(column: string, value: string): { select(columns?: string): { single(): PromiseLike<{ data: unknown; error: DbError | null }> } } };
  delete(): { eq(column: string, value: string): PromiseLike<{ error: DbError | null }> };
};

type DbError = { message: string; code?: string; details?: string };
type UploadedFile = File & { name: string; size: number; type: string; arrayBuffer(): Promise<ArrayBuffer> };

const tableNames = [
  "photos",
  "videos",
  "timeline",
  "letters",
  "special_dates",
  "secret_cards",
  "home_images",
  "story_chapters",
  "story_assets",
] as const;

const tableSet = new Set<string>(tableNames);

function text(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function bool(formData: FormData, key: string) {
  return text(formData, key, "false") === "true";
}

function numberOrNull(formData: FormData, key: string) {
  const value = Number(text(formData, key, ""));
  return Number.isFinite(value) ? value : null;
}

function extensionFor(file: UploadedFile) {
  const ext = path.extname(file.name);
  if (ext) return ext;
  if (file.type.includes("mp4")) return ".mp4";
  if (file.type.includes("quicktime")) return ".mov";
  if (file.type.includes("webp")) return ".webp";
  if (file.type.includes("png")) return ".png";
  return ".jpg";
}

function uploadedFile(value: FormDataEntryValue | null): UploadedFile | null {
  if (!value || typeof value === "string") return null;
  const candidate = value as Partial<UploadedFile>;
  if (typeof candidate.arrayBuffer !== "function" || typeof candidate.size !== "number") return null;
  if (candidate.size <= 0) return null;
  return value as UploadedFile;
}

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === SESSION_VALUE;
}

async function uploadFile(file: UploadedFile | null, bucket: "photos" | "videos", prefix: string) {
  if (!file || file.size === 0) return "";
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Cloud archive is not ready yet.");
  const filePath = `${prefix}/${randomUUID()}${extensionFor(file)}`;
  console.log("[admin/content] uploading file:", {
    bucket,
    filePath,
    name: file.name,
    size: file.size,
    type: file.type,
  });
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  console.log("[admin/content] uploaded storage path:", filePath);
  console.log("[admin/content] public URL:", data.publicUrl);
  return data.publicUrl;
}

function tablePayload(table: string, formData: FormData, fileUrl: string) {
  const common = {
    title: text(formData, "title", "Untitled"),
    date: text(formData, "date", new Date().toISOString().slice(0, 10)),
    description: text(formData, "description"),
    featured: bool(formData, "featured"),
    pinned: bool(formData, "pinned"),
    sort_order: numberOrNull(formData, "sortOrder"),
  };

  if (table === "photos") {
    return {
      ...common,
      category: text(formData, "category", "Favorite Moments"),
      src: fileUrl || text(formData, "src", "/photos/gallery-1.svg"),
      height: text(formData, "height", "medium"),
    };
  }
  if (table === "videos") {
    const videoSrc = fileUrl || text(formData, "videoSrc");
    const externalUrl = text(formData, "externalUrl") || null;
    if (!videoSrc && !externalUrl) {
      throw new Error("Please upload a video file or provide an external video URL.");
    }
    return {
      ...common,
      category: text(formData, "category", "Favorite Moments"),
      video_src: videoSrc,
      external_url: externalUrl,
    };
  }
  if (table === "timeline") {
    return {
      ...common,
      category: text(formData, "category") || null,
      image: fileUrl || text(formData, "image") || null,
      accent: text(formData, "accent", "Rose"),
    };
  }
  if (table === "letters") {
    return {
      title: common.title,
      date: common.date,
      author: text(formData, "author", "Me"),
      content: text(formData, "content", common.description),
      featured: common.featured,
      pinned: common.pinned,
      sort_order: common.sort_order,
    };
  }
  if (table === "special_dates") {
    return {
      title: common.title,
      date: common.date,
      label: text(formData, "label", "纪念日"),
      description: common.description,
      featured: common.featured,
      pinned: common.pinned,
      sort_order: common.sort_order,
    };
  }
  if (table === "secret_cards") {
    return {
      title: common.title,
      content: text(formData, "content", common.description),
      category: text(formData, "category", "Private"),
      date: text(formData, "date") || null,
      image: fileUrl || text(formData, "image") || null,
      featured: common.featured,
      pinned: common.pinned,
      sort_order: common.sort_order,
    };
  }
  if (table === "home_images") {
    return {
      title: common.title,
      image: fileUrl || text(formData, "image", "/photos/couple-1.svg"),
      slot: text(formData, "slot", "hero_left"),
      description: common.description,
      pinned: common.pinned,
      sort_order: common.sort_order,
    };
  }
  if (table === "story_chapters") {
    return {
      eyebrow: text(formData, "eyebrow", "Chapter"),
      title: common.title,
      content: text(formData, "content", common.description),
      image: fileUrl || text(formData, "image") || null,
      pinned: common.pinned,
      sort_order: common.sort_order,
    };
  }
  if (table === "story_assets") {
    return {
      title: common.title,
      image: fileUrl || text(formData, "image", "/photos/story.svg"),
      slot: text(formData, "slot", "main"),
      description: common.description,
      pinned: common.pinned,
      sort_order: common.sort_order,
    };
  }
  return common;
}

function getTable(name: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Cloud archive is not ready yet.");
  return supabase.from(name) as unknown as AnyTable;
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const table = new URL(request.url).searchParams.get("table") ?? "";
  if (!tableSet.has(table)) return NextResponse.json({ ok: false, message: "Unknown table" }, { status: 400 });
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: false, message: "Cloud archive is not ready yet." }, { status: 503 });

  const { data, error } = await getTable(table).select("*").order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, items: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: false, message: "Cloud archive is not ready yet." }, { status: 503 });

  try {
    const formData = await request.formData();
    const table = text(formData, "table");
    if (!tableSet.has(table)) return NextResponse.json({ ok: false, message: "Unknown table" }, { status: 400 });

    const file = uploadedFile(formData.get("file"));
    const isVideo = table === "videos";
    const fileUrl = await uploadFile(file, isVideo ? "videos" : "photos", table);
    const payload = tablePayload(table, formData, fileUrl);
    const result = await getTable(table).insert(payload).select("*").single();
    console.log("[admin/content] insert result:", result);
    if (result.error) return NextResponse.json({ ok: false, message: result.error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: result.data });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Unable to save content." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: false, message: "Cloud archive is not ready yet." }, { status: 503 });

  try {
    const formData = await request.formData();
    const table = text(formData, "table");
    const id = text(formData, "id");
    if (!tableSet.has(table) || !id) return NextResponse.json({ ok: false, message: "Missing table or id" }, { status: 400 });

    const file = uploadedFile(formData.get("file"));
    const isVideo = table === "videos";
    const fileUrl = await uploadFile(file, isVideo ? "videos" : "photos", table);
    const payload = tablePayload(table, formData, fileUrl);
    const result = await getTable(table).update(payload).eq("id", id).select("*").single();
    console.log("[admin/content] update result:", result);
    if (result.error) return NextResponse.json({ ok: false, message: result.error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: result.data });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Unable to update content." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ ok: false, message: "Cloud archive is not ready yet." }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table") ?? "";
  const id = searchParams.get("id") ?? "";
  if (!tableSet.has(table) || !id) return NextResponse.json({ ok: false, message: "Missing table or id" }, { status: 400 });

  const { error } = await getTable(table).delete().eq("id", id);
  console.log("[admin/content] delete result:", { table, id, error });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
