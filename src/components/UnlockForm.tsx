"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

type UnlockFormProps = {
  mode: "site" | "admin";
};

export function UnlockForm({ mode }: UnlockFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = mode === "admin";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const response = await fetch(isAdmin ? "/api/auth/admin-login" : "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setSubmitting(false);

    if (!response.ok) {
      setError("密码不对，再试一次。");
      return;
    }

    router.replace(searchParams.get("next") || (isAdmin ? "/admin" : "/"));
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070d] px-5 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,117,140,0.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(207,167,91,0.18),transparent_28%),radial-gradient(circle_at_52%_92%,rgba(118,88,190,0.22),transparent_34%),linear-gradient(135deg,#090812_0%,#17101f_48%,#251118_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(255,255,255,0.2)_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_18%,rgba(242,196,204,0.25)_0_1px,transparent_1.5px)] bg-[size:180px_180px,240px_240px] opacity-60" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
      <motion.section
        className="relative w-full max-w-[460px] rounded-[32px] border border-white/14 bg-white/[0.08] p-7 shadow-[0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-9"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex h-13 w-13 items-center justify-center rounded-full border border-white/20 bg-white/10">
          <Heart className="h-5 w-5 text-[#ffd9df]" />
        </div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.36em] text-[#ffd3d9]/80">
          {isAdmin ? "Private Atelier" : "Private Memory"}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {isAdmin ? "Add a New Memory" : "Our Story"}
        </h1>
        <p className="mt-4 text-base leading-7 text-white/66">
          {isAdmin ? "输入管理密码，把新的回忆收藏进来。" : "输入情侣密码，进入只属于你们的纪念空间。"}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label htmlFor="password" className="text-sm font-medium text-white/78">
            {isAdmin ? "Admin Password" : "Couple Password"}
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-13 w-full rounded-2xl border border-white/14 bg-white/[0.08] pl-12 pr-4 text-white outline-none transition placeholder:text-white/28 focus:border-[#ffd3d9]/70 focus:ring-4 focus:ring-[#ffd3d9]/10"
              placeholder="Love..."
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-sm text-[#ffb0b9]">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="luxury-button h-13 w-full rounded-2xl bg-[#f0c2ca] px-5 text-sm font-bold uppercase tracking-[0.22em] text-[#211116] shadow-[0_16px_40px_rgba(240,194,202,0.22)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Opening..." : "Unlock"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}
