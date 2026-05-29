"use client";

import { useTimelineMemories } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function TimelinePage() {
  const timeline = useTimelineMemories();

  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Timeline"
          title="A timeline for the days that changed everything."
          description="记录重要日期、旅行、告白、周年和所有值得回头看的节点。"
        />
        <div className="mt-12 space-y-5">
          {timeline.map((item, index) => (
            <article
              key={item.id}
              className="relative grid gap-5 rounded-[30px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl sm:grid-cols-[180px_1fr]"
            >
              <div>
                <p className="text-sm font-semibold text-[#f2c4cc]">{item.accent}</p>
                <time className="mt-2 block text-2xl font-semibold">{item.date}</time>
              </div>
              <div>
                <p className="text-sm text-white/34">Memory {String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 text-3xl font-semibold">{item.title}</h2>
                <p className="mt-3 leading-8 text-white/60">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </PageTransition>
    </SiteShell>
  );
}
