"use client";

import { VideoGrid } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function VideosPage() {
  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Video Memories"
          title="Videos for the memories that deserve motion."
          description="有些回忆需要声音、光影和时间本身，才完整地回到眼前。"
        />
        <div className="mt-10">
          <VideoGrid />
        </div>
      </PageTransition>
    </SiteShell>
  );
}
