"use client";

import Image from "next/image";
import { useStoryAssets, useStoryChapters } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function StoryPage() {
  const assets = useStoryAssets();
  const chapters = useStoryChapters();
  const storyImage = assets.find((item) => item.slot === "main")?.image ?? "/photos/story.svg";

  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Our Story"
          title="The long version of how we became us."
          description="从第一次靠近，到后来每一次坚定选择，所有章节都值得被认真收藏。"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.07] p-3 backdrop-blur-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[26px]">
              <Image src={storyImage} alt="Our story" fill unoptimized={storyImage.startsWith("https://")} sizes="(min-width: 1024px) 34vw, 92vw" className="object-cover" />
            </div>
          </div>
          <article className="rounded-[34px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl sm:p-9">
            <div className="space-y-8">
              {chapters.map((chapter) => (
                <section key={chapter.id} className="border-b border-white/10 pb-8 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2c4cc]/75">{chapter.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{chapter.title}</h2>
                  <p className="mt-4 leading-8 text-white/60">{chapter.content}</p>
                </section>
              ))}
            </div>
          </article>
        </div>
      </PageTransition>
    </SiteShell>
  );
}
