"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Play, Star, X } from "lucide-react";
import {
  categories,
  homeImages,
  letters,
  photos,
  secretCards,
  specialDates,
  storyAssets,
  storyChapters,
  timeline,
  videos,
  type HomeImage,
  type Letter,
  type MemoryCategory,
  type PhotoMemory,
  type SecretCard,
  type SpecialDate,
  type StoryAsset,
  type StoryChapter,
  type TimelineMemory,
  type VideoMemory,
} from "@/data/memories";
import { fetchMemories } from "@/lib/storage";

export function usePhotoMemories() {
  const [items, setItems] = useState<PhotoMemory[]>(photos);

  useEffect(() => {
    const sync = () => {
      void fetchMemories()
        .then((store) => setItems(store.photos.length ? store.photos : photos))
        .catch(() => setItems(photos));
    };
    sync();
    window.addEventListener("love-site-uploads-changed", sync);
    return () => {
      window.removeEventListener("love-site-uploads-changed", sync);
    };
  }, []);

  return useMemo(() => items, [items]);
}

export function useVideoMemories() {
  const [items, setItems] = useState<VideoMemory[]>(videos);

  useEffect(() => {
    const sync = () => {
      void fetchMemories()
        .then((store) => setItems(store.videos.length ? store.videos : videos))
        .catch(() => setItems(videos));
    };
    sync();
    window.addEventListener("love-site-uploads-changed", sync);
    return () => {
      window.removeEventListener("love-site-uploads-changed", sync);
    };
  }, []);

  return useMemo(() => items, [items]);
}

export function useTimelineMemories() {
  const [items, setItems] = useState<TimelineMemory[]>(timeline);

  useEffect(() => {
    const sync = () => {
      void fetchMemories()
        .then((store) => setItems(store.timeline.length ? store.timeline : timeline))
        .catch(() => setItems(timeline));
    };
    sync();
    window.addEventListener("love-site-uploads-changed", sync);
    return () => {
      window.removeEventListener("love-site-uploads-changed", sync);
    };
  }, []);

  return useMemo(() => items, [items]);
}

function useCloudList<T>(key: keyof Awaited<ReturnType<typeof fetchMemories>>, fallback: T[]) {
  const [items, setItems] = useState<T[]>(fallback);

  useEffect(() => {
    const sync = () => {
      void fetchMemories()
        .then((store) => {
          const next = store[key] as T[];
          setItems(next.length ? next : fallback);
        })
        .catch(() => setItems(fallback));
    };
    sync();
    window.addEventListener("love-site-uploads-changed", sync);
    return () => window.removeEventListener("love-site-uploads-changed", sync);
  }, [fallback, key]);

  return items;
}

export function useLetters() {
  return useCloudList<Letter>("letters", letters);
}

export function useSpecialDates() {
  return useCloudList<SpecialDate>("specialDates", specialDates);
}

export function useSecretCards() {
  return useCloudList<SecretCard>("secretCards", secretCards);
}

export function useHomeImages() {
  return useCloudList<HomeImage>("homeImages", homeImages);
}

export function useStoryChapters() {
  return useCloudList<StoryChapter>("storyChapters", storyChapters);
}

export function useStoryAssets() {
  return useCloudList<StoryAsset>("storyAssets", storyAssets);
}

export function GalleryMasonry({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const allPhotos = usePhotoMemories();
  const [selectedCategory, setSelectedCategory] = useState<"All" | MemoryCategory>("All");
  const [activePhoto, setActivePhoto] = useState<PhotoMemory | null>(null);

  const visiblePhotos = allPhotos.filter((photo) => {
    if (featuredOnly && !photo.featured) {
      return false;
    }
    return selectedCategory === "All" || photo.category === selectedCategory;
  });

  return (
    <div>
      {!featuredOnly ? (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              type="button"
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "border-[#f2c4cc] bg-[#f2c4cc] text-[#241116]"
                  : "border-white/12 bg-white/[0.06] text-white/62 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {visiblePhotos.map((photo, index) => (
          <motion.button
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            type="button"
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-2 text-left shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035, duration: 0.38 }}
          >
            <div className={`relative overflow-hidden rounded-[22px] ${heightClass(photo.height)}`}>
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                priority={index < 2}
                unoptimized={isSupabaseImage(photo.src)}
                sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 94vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent opacity-80" />
              {photo.featured ? (
                <span className="absolute right-3 top-3 rounded-full bg-[#f2c4cc] p-2 text-[#241116]">
                  <Star className="h-4 w-4 fill-current" />
                </span>
              ) : null}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ffd3d9]/80">
                  {photo.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">{photo.title}</h3>
                <p className="mt-1 text-sm text-white/62">{photo.date}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {activePhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-4 backdrop-blur-xl" onClick={() => setActivePhoto(null)}>
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/12 bg-[#100d16]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              type="button"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/11]">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                unoptimized={isSupabaseImage(activePhoto.src)}
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <div className="border-t border-white/10 p-5">
              <p className="text-sm text-[#f2c4cc]">{activePhoto.category} · {activePhoto.date}</p>
              <h3 className="mt-2 text-2xl font-semibold">{activePhoto.title}</h3>
              <p className="mt-2 text-white/62">{activePhoto.description}</p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}

export function VideoGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const allVideos = useVideoMemories();
  const [activeVideo, setActiveVideo] = useState<VideoMemory | null>(null);
  const visibleVideos = featuredOnly ? allVideos.filter((video) => video.featured) : allVideos;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleVideos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} onOpen={() => setActiveVideo(video)} />
        ))}
      </div>

      {activeVideo ? <VideoLightbox video={activeVideo} onClose={() => setActiveVideo(null)} /> : null}
    </>
  );
}

function VideoCard({ video, index, onOpen }: { video: VideoMemory; index: number; onOpen: () => void }) {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [canPreview, setCanPreview] = useState(false);
  const hasVideo = Boolean(video.videoSrc);

  function playPreview() {
    const preview = previewRef.current;
    if (!preview || !hasVideo) return;
    preview.currentTime = preview.currentTime || 0;
    void preview.play().catch(() => undefined);
  }

  function pausePreview() {
    const preview = previewRef.current;
    if (!preview || !hasVideo) return;
    preview.pause();
    preview.currentTime = 0;
  }

  return (
    <motion.article
      className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.38 }}
      onMouseEnter={playPreview}
      onMouseLeave={pausePreview}
    >
      <button type="button" onClick={hasVideo ? onOpen : undefined} className="block w-full text-left" disabled={!hasVideo}>
        <div className="relative aspect-video overflow-hidden">
          <DefaultVideoCover visible={!canPreview || !hasVideo} />
          {hasVideo ? (
            <video
              ref={previewRef}
              src={video.videoSrc}
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                canPreview ? "opacity-100" : "opacity-0"
              } group-hover:scale-[1.03]`}
              muted
              playsInline
              preload="metadata"
              onLoadedData={() => setCanPreview(true)}
              onError={() => setCanPreview(false)}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/12 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-black/38 px-3 py-1 text-xs font-medium text-white/78 backdrop-blur">
            {video.category}
          </div>
          <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c4cc] text-[#241116] transition group-hover:scale-105">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
      </button>
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-white/48">
          <Calendar className="h-4 w-4" />
          {video.date}
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-white">{video.title}</h3>
        <p className="mt-2 leading-7 text-white/58">{video.description}</p>
        {!hasVideo && video.externalUrl ? (
          <a
            href={video.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/72 transition hover:bg-white/12 hover:text-white"
          >
            Open video link
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function VideoLightbox({ video, onClose }: { video: VideoMemory; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/84 p-4 backdrop-blur-xl" onClick={onClose}>
      <motion.div
        className="relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/12 bg-[#100d16]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
          aria-label="Close video"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative aspect-video bg-black">
          {video.videoSrc ? (
            <video src={video.videoSrc} className="h-full w-full" controls autoPlay playsInline />
          ) : (
            <DefaultVideoCover visible />
          )}
        </div>
        <div className="border-t border-white/10 p-5">
          <p className="text-sm text-[#f2c4cc]">{video.category} · {video.date}</p>
          <h3 className="mt-2 text-2xl font-semibold">{video.title}</h3>
          <p className="mt-2 text-white/62">{video.description}</p>
        </div>
      </motion.div>
    </div>
  );
}

function DefaultVideoCover({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(242,196,204,0.38),transparent_32%),radial-gradient(circle_at_78%_15%,rgba(255,226,178,0.22),transparent_28%),linear-gradient(135deg,#21101b_0%,#0e0b14_52%,#261821_100%)] transition duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(255,255,255,0.32)_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_18%,rgba(242,196,204,0.3)_0_1px,transparent_1.5px)] bg-[size:120px_120px,180px_180px] opacity-60" />
    </div>
  );
}

function heightClass(height: PhotoMemory["height"]) {
  if (height === "short") {
    return "aspect-[4/3]";
  }
  if (height === "tall") {
    return "aspect-[3/4]";
  }
  return "aspect-[4/5]";
}

function isSupabaseImage(src: string) {
  return src.startsWith("https://scqontrgxdlzzkfobsob.supabase.co/");
}
