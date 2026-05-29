"use client";

import { KeyRound, Sparkles } from "lucide-react";
import Image from "next/image";
import { useSecretCards } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function SecretRoomPage() {
  const cards = useSecretCards();

  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Secret Room"
          title="A private room for the memories closest to the heart."
          description="这里适合放只有你们两个人懂的约定、愿望清单、惊喜计划，或者更私密的照片和文字。"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.id} className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
              {card.image ? (
                <div className="relative -mx-3 -mt-3 mb-6 aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image src={card.image} alt={card.title} fill unoptimized={card.image.startsWith("https://")} className="object-cover" />
                </div>
              ) : null}
              <KeyRound className="h-7 w-7 text-[#f2c4cc]" />
              <p className="mt-4 text-sm text-[#f2c4cc]">{card.category}{card.date ? ` · ${card.date}` : ""}</p>
              <h2 className="mt-2 text-3xl font-semibold">{card.title}</h2>
              <p className="mt-4 leading-8 text-white/58">{card.content}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-[32px] border border-[#f2c4cc]/20 bg-[#f2c4cc]/10 p-7 backdrop-blur-xl">
          <Sparkles className="h-7 w-7 text-[#f2c4cc]" />
          <p className="mt-4 leading-8 text-white/64">
            有些话适合晚一点打开，有些愿望适合一起慢慢实现。
          </p>
        </div>
      </PageTransition>
    </SiteShell>
  );
}
