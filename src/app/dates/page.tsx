"use client";

import { CalendarDays, HeartHandshake } from "lucide-react";
import { LoadingMemoryGrid, useSpecialDates } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

function daysSince(date: string) {
  const start = new Date(`${date}T00:00:00`);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
}

export default function DatesPage() {
  const { items: specialDates, loaded } = useSpecialDates();

  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Special Dates"
          title="Important dates, beautifully remembered."
          description="纪念日、第一次旅行、第一次见面、生日，都可以放在这里。"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {!loaded ? <LoadingMemoryGrid count={3} /> : specialDates.map((item) => (
            <article key={item.id} className="rounded-[32px] border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
              <CalendarDays className="h-7 w-7 text-[#f2c4cc]" />
              <p className="mt-6 text-sm text-white/45">{item.note}</p>
              <h2 className="mt-2 text-3xl font-semibold">{item.title}</h2>
              <time className="mt-4 block text-lg text-[#f2c4cc]">{item.date}</time>
              {item.description ? <p className="mt-3 leading-7 text-white/56">{item.description}</p> : null}
              <div className="mt-7 rounded-3xl border border-white/10 bg-black/16 p-5">
                <HeartHandshake className="h-5 w-5 text-white/55" />
                <p className="mt-3 text-4xl font-semibold">{daysSince(item.date)}</p>
                <p className="mt-1 text-sm text-white/45">days saved</p>
              </div>
            </article>
          ))}
        </div>
      </PageTransition>
    </SiteShell>
  );
}
