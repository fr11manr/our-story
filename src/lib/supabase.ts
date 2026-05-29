import { createClient } from "@supabase/supabase-js";
import type { PhotoMemory, TimelineMemory, VideoMemory } from "@/data/memories";

export type DatabasePhoto = {
  id: string;
  title: string;
  date: string;
  category: PhotoMemory["category"];
  description: string;
  src: string;
  featured: boolean;
  pinned?: boolean | null;
  sort_order?: number | null;
  height: PhotoMemory["height"] | null;
  created_at?: string;
};

export type DatabaseVideo = {
  id: string;
  title: string;
  date: string;
  category: VideoMemory["category"];
  description: string;
  cover?: string | null;
  video_src: string | null;
  external_url: string | null;
  featured: boolean;
  pinned?: boolean | null;
  sort_order?: number | null;
  created_at?: string;
};

export type DatabaseTimeline = {
  id: string;
  date: string;
  title: string;
  description: string;
  accent: string | null;
  image?: string | null;
  category?: string | null;
  featured?: boolean | null;
  pinned?: boolean | null;
  sort_order?: number | null;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      photos: {
        Row: DatabasePhoto;
        Insert: Omit<DatabasePhoto, "id" | "created_at"> & { id?: string };
        Update: Partial<DatabasePhoto>;
        Relationships: [];
      };
      videos: {
        Row: DatabaseVideo;
        Insert: Omit<DatabaseVideo, "id" | "created_at"> & { id?: string };
        Update: Partial<DatabaseVideo>;
        Relationships: [];
      };
      timeline: {
        Row: DatabaseTimeline;
        Insert: Omit<DatabaseTimeline, "id" | "created_at"> & { id?: string };
        Update: Partial<DatabaseTimeline>;
        Relationships: [];
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function isSupabaseAdminConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function photoFromRow(row: DatabasePhoto): PhotoMemory {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category: row.category,
    description: row.description,
    src: row.src,
    featured: row.featured,
    pinned: Boolean(row.pinned),
    sortOrder: row.sort_order ?? undefined,
    height: row.height ?? "medium",
  };
}

export function videoFromRow(row: DatabaseVideo): VideoMemory {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category: row.category,
    description: row.description,
    cover: row.cover ?? undefined,
    videoSrc: row.video_src ?? undefined,
    externalUrl: row.external_url ?? undefined,
    featured: row.featured,
    pinned: Boolean(row.pinned),
    sortOrder: row.sort_order ?? undefined,
  };
}

export function timelineFromRow(row: DatabaseTimeline): TimelineMemory {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    description: row.description,
    accent: row.accent ?? "Rose",
    image: row.image ?? undefined,
    category: row.category ?? undefined,
    featured: Boolean(row.featured),
    pinned: Boolean(row.pinned),
    sortOrder: row.sort_order ?? undefined,
  };
}
