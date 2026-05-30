import type {
  HomeImage,
  Letter,
  PhotoMemory,
  SecretCard,
  SpecialDate,
  StoryAsset,
  StoryChapter,
  TimelineMemory,
  VideoMemory,
} from "@/data/memories";

export async function fetchMemories() {
  if (memoryCache) return memoryCache;
  if (memoryRequest) return memoryRequest;

  memoryRequest = loadMemories().finally(() => {
    memoryRequest = null;
  });
  return memoryRequest;
}

export function invalidateMemoriesCache() {
  memoryCache = null;
  memoryRequest = null;
}

type MemoryStore = {
  photos: PhotoMemory[];
  videos: VideoMemory[];
  timeline: TimelineMemory[];
  letters: Letter[];
  specialDates: SpecialDate[];
  secretCards: SecretCard[];
  homeImages: HomeImage[];
  storyChapters: StoryChapter[];
  storyAssets: StoryAsset[];
};

let memoryCache: MemoryStore | null = null;
let memoryRequest: Promise<MemoryStore> | null = null;

async function loadMemories() {
  const response = await fetch("/api/memories", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load memories");
  }
  memoryCache = (await response.json()) as MemoryStore;
  return memoryCache;
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

  invalidateMemoriesCache();
  window.dispatchEvent(new Event("love-site-uploads-changed"));
  return payload as { ok: true; item?: unknown; videoUrl?: string };
}
