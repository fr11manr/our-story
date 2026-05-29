"use client";

import { MessageCircleHeart } from "lucide-react";
import { useLetters } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function LettersPage() {
  const letters = useLetters();

  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Letters"
          title="Love letters, notes, and words only you two understand."
          description="这里可以放长情书、日常留言、道歉信、纪念日祝福，也可以之后扩展成真正的留言板。"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {letters.map((letter) => (
            <article key={letter.id} className="rounded-[32px] border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
              <MessageCircleHeart className="h-7 w-7 text-[#f2c4cc]" />
              <p className="mt-6 text-sm text-white/45">{letter.date} · From {letter.from}</p>
              <h2 className="mt-3 text-3xl font-semibold">{letter.title}</h2>
              <p className="mt-5 leading-8 text-white/60">{letter.body}</p>
            </article>
          ))}
        </div>
      </PageTransition>
    </SiteShell>
  );
}
