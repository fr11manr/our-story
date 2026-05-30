"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarHeart, Heart, Images, MessageCircleHeart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { GalleryMasonry, LoadingMemoryGrid, VideoGrid, useHomeImages, useLetters, useTimelineMemories } from "@/components/MemoryCards";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";

export default function Home() {
  return (
    <SiteShell>
      <PageTransition>
        <Hero />
        <MemoryHighlights />
        <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <StoryPreview />
          <TimelinePreview />
        </section>
        <section className="mt-16">
          <SectionHeader
            eyebrow="Featured Photos"
            title="A gallery that keeps the light."
            description="那些被偏爱的画面，会在这里安静相遇，像夜里被重新点亮的小星星。"
          />
          <div className="mt-8">
            <GalleryMasonry featuredOnly />
          </div>
        </section>
        <section className="mt-16">
          <SectionHeader
            eyebrow="Featured Videos"
            title="Moments that still move."
            description="把笑声、风声、拥抱和远方都留在时间里，等以后慢慢回放。"
          />
          <div className="mt-8">
            <VideoGrid featuredOnly />
          </div>
        </section>
        <LoveNotes />
      </PageTransition>
    </SiteShell>
  );
}

function Hero() {
  const { items: images, loaded } = useHomeImages();
  const bySlot = {
    hero_left: images.find((item) => item.slot === "hero_left")?.image ?? "/photos/couple-1.svg",
    hero_right: images.find((item) => item.slot === "hero_right")?.image ?? "/photos/couple-2.svg",
    hero_wide: images.find((item) => item.slot === "hero_wide")?.image ?? "/photos/story.svg",
  };
  const heroImages = [bySlot.hero_left, bySlot.hero_right, bySlot.hero_wide];

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10 lg:min-h-[620px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(242,196,204,0.22),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_52%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#f3bbc6]/76">
            Private Anniversary Website
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Our story, held beautifully.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">
            一座只为你们打开的私密纪念馆，收藏照片、影像、信件、日期，以及那些不必解释也懂得的心动。
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2c4cc] px-6 py-3 text-sm font-bold text-[#241116] shadow-[0_16px_50px_rgba(242,196,204,0.24)] transition hover:bg-white"
            >
              Explore Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/12 hover:text-white"
            >
              Upload Memory
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {!loaded ? (
            <>
              <div className="aspect-[4/5] animate-pulse rounded-[30px] border border-white/12 bg-white/10" />
              <div className="aspect-[4/5] animate-pulse rounded-[30px] border border-white/12 bg-white/10" />
              <div className="col-span-2 aspect-[16/9] animate-pulse rounded-[30px] border border-white/12 bg-white/10" />
            </>
          ) : heroImages.map((src, index) => (
            <motion.div
              key={src}
              className={`relative overflow-hidden rounded-[30px] border border-white/12 bg-white/10 shadow-2xl ${
                index === 2 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"
              }`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={index < 2}
                unoptimized={src.startsWith("https://")}
                sizes="(min-width: 1024px) 24vw, 45vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemoryHighlights() {
  const cards = [
    { icon: Images, label: "Photos", value: "Endless", text: "每一张都带着那天的温度" },
    { icon: CalendarHeart, label: "Dates", value: "Forever", text: "把重要日子郑重地留下" },
    { icon: MessageCircleHeart, label: "Letters", value: "Private", text: "写给彼此，也写给未来" },
    { icon: Sparkles, label: "Secret", value: "Hidden", text: "只在这里轻轻打开的心事" },
  ];

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.article
            key={card.label}
            className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.06 }}
          >
            <Icon className="h-6 w-6 text-[#f2c4cc]" />
            <p className="mt-5 text-sm text-white/45">{card.label}</p>
            <h3 className="mt-1 text-2xl font-semibold">{card.value}</h3>
            <p className="mt-3 text-sm leading-6 text-white/55">{card.text}</p>
          </motion.article>
        );
      })}
    </section>
  );
}

function StoryPreview() {
  return (
    <article className="rounded-[32px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl sm:p-8">
      <Heart className="h-7 w-7 text-[#f2c4cc]" />
      <h2 className="mt-6 text-3xl font-semibold">Our Story</h2>
      <p className="mt-4 leading-8 text-white/60">
        从一个很小的瞬间开始，到后来每一天都有了彼此的名字。这里会承载你们完整的相识、心动、告白、旅行和未来。
      </p>
      <Link href="/story" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f2c4cc]">
        Read the story
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function TimelinePreview() {
  const { items: timeline, loaded } = useTimelineMemories();

  return (
    <article className="rounded-[32px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl sm:p-8">
      <h2 className="text-3xl font-semibold">Timeline</h2>
      <div className="mt-6 space-y-4">
        {!loaded ? <LoadingMemoryGrid count={3} /> : timeline.slice(0, 3).map((item) => (
          <div key={item.id} className="grid gap-3 rounded-3xl border border-white/10 bg-black/14 p-4 sm:grid-cols-[120px_1fr]">
            <time className="text-sm font-semibold text-[#f2c4cc]">{item.date}</time>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-white/52">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function LoveNotes() {
  const { items: letters, loaded } = useLetters();

  return (
    <section className="mt-16">
      <SectionHeader eyebrow="Love Notes" title="Words worth keeping." />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {!loaded ? <LoadingMemoryGrid count={2} /> : letters.map((letter) => (
          <article key={letter.id} className="rounded-[30px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl">
            <p className="text-sm text-[#f2c4cc]">{letter.date} · {letter.from}</p>
            <h3 className="mt-3 text-2xl font-semibold">{letter.title}</h3>
            <p className="mt-4 leading-8 text-white/58">{letter.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
