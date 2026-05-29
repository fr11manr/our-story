import Image from "next/image";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function StoryPage() {
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
              <Image src="/photos/story.svg" alt="Our story" fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-cover" />
            </div>
          </div>
          <article className="rounded-[34px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl sm:p-9">
            <div className="space-y-8">
              {[
                ["Chapter 01", "The First Spark", "我们的故事可以从一个很小的瞬间开始：一次对视、一条消息、一顿饭，或者某个突然觉得“原来是你”的下午。"],
                ["Chapter 02", "Growing Closer", "后来，一些普通日子开始有了共同的节奏。一起走路、一起吃饭、一起把无聊的事情讲得很好笑。"],
                ["Chapter 03", "Choosing Each Other", "爱不是只有盛大瞬间，也是在很多细小选择里一次次坚定：今天也是你，明天也想是你。"],
              ].map(([eyebrow, title, text]) => (
                <section key={title} className="border-b border-white/10 pb-8 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2c4cc]/75">{eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
                  <p className="mt-4 leading-8 text-white/60">{text}</p>
                </section>
              ))}
            </div>
          </article>
        </div>
      </PageTransition>
    </SiteShell>
  );
}
