"use client";

import { GalleryMasonry } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function GalleryPage() {
  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Gallery"
          title="A constellation of every kind of memory."
          description="约会、旅行、日常、食物和最偏爱的瞬间，都在这里慢慢铺成你们的宇宙。"
        />
        <div className="mt-10">
          <GalleryMasonry />
        </div>
      </PageTransition>
    </SiteShell>
  );
}
