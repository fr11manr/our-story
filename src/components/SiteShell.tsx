"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarHeart,
  Clapperboard,
  Heart,
  Home,
  Image,
  KeyRound,
  Menu,
  MessageCircleHeart,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/story", label: "Our Story", icon: Heart },
  { href: "/timeline", label: "Timeline", icon: Sparkles },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/videos", label: "Video Memories", icon: Clapperboard },
  { href: "/letters", label: "Letters", icon: MessageCircleHeart },
  { href: "/dates", label: "Special Dates", icon: CalendarHeart },
  { href: "/secret-room", label: "Secret Room", icon: KeyRound },
  { href: "/admin", label: "Add Memory", icon: UploadCloud },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function lock() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/unlock";
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#07070d] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_9%,rgba(239,117,142,0.22),transparent_31%),radial-gradient(circle_at_88%_18%,rgba(203,168,95,0.16),transparent_28%),radial-gradient(circle_at_50%_96%,rgba(98,72,163,0.2),transparent_32%),linear-gradient(135deg,#07070d_0%,#12101c_46%,#241016_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_24%_28%,rgba(255,255,255,0.16)_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_18%,rgba(242,196,204,0.22)_0_1px,transparent_1.5px),radial-gradient(circle_at_82%_78%,rgba(255,232,191,0.18)_0_1px,transparent_1.5px)] bg-[size:190px_190px,240px_240px,280px_280px] opacity-55" />
      <div className="fixed left-1/2 top-0 -z-10 h-[520px] w-[min(920px,92vw)] -translate-x-1/2 rounded-full bg-[#f2c4cc]/12 blur-[120px]" />
      <div className="fixed bottom-[-180px] right-[-120px] -z-10 h-[460px] w-[460px] rounded-full bg-[#8e65ff]/12 blur-[110px]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08070d]/68 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/14 bg-white/10">
              <Heart className="h-5 w-5 text-[#ffd1d8]" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.22em] text-white">OUR STORY</span>
              <span className="block text-xs text-white/45">Private anniversary archive</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1 lg:flex">
            {navItems.slice(0, 8).map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                    active ? "text-[#241116]" : "text-white/64 hover:text-white"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#f2c4cc]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/admin"
              className="rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-sm font-medium text-white/72 transition hover:bg-white/12 hover:text-white"
            >
              Admin
            </Link>
            <button
              onClick={lock}
              type="button"
              className="rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-sm font-medium text-white/72 transition hover:bg-white/12 hover:text-white"
            >
              Lock
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((value) => !value)}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.07] lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen ? (
          <motion.nav
            className="mx-5 mb-4 grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.07] p-3 backdrop-blur-2xl sm:mx-6 lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                    active ? "bg-[#f2c4cc] text-[#241116]" : "text-white/72"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={lock}
              type="button"
              className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-white/72"
            >
              Lock
            </button>
          </motion.nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-14">{children}</main>
    </div>
  );
}
