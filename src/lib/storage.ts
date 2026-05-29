import type { PhotoMemory, TimelineMemory, VideoMemory } from "@/data/memories";

export async function fetchMemories() {
  const response = await fetch("/api/memories", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load memories");
  }
  return (await response.json()) as {
    photos: PhotoMemory[];
    videos: VideoMemory[];
    timeline: TimelineMemory[];
  };
}

export async function uploadMemory(formData: FormData) {
  console.log("[admin] calling /api/uploads", {
    type: formData.get("type"),
    kind: formData.get("kind"),
    hasVideo: formData.has("video"),
    hasPhoto: formData.has("photo"),
  });

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
    item?: unknown;
    videoUrl?: string;
  };

  console.log("[admin] /api/uploads response", {
    status: response.status,
    ok: response.ok,
    payload,
  });

  if (!response.ok) {
    throw new Error(payload.message ?? "Upload failed");
  }

  if (!payload.ok) {
    throw new Error(payload.message ?? "Upload failed");
  }

  window.dispatchEvent(new Event("love-site-uploads-changed"));
  return payload as { ok: true; item?: unknown; videoUrl?: string };
}
