"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, ImagePlus, Sparkles, UploadCloud, Video } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";
import { categories, type MemoryCategory } from "@/data/memories";
import { uploadMemory } from "@/lib/storage";

const uploadCategories = categories.filter((category): category is MemoryCategory => category !== "All");

type UploadType = "photo" | "video";

export default function AdminPage() {
  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Memory Atelier"
          title="Add a New Memory"
          description="把今天值得珍藏的画面、声音和心情，放进只属于你们的纪念馆。"
        />
        <AdminUploadForm />
      </PageTransition>
    </SiteShell>
  );
}

function AdminUploadForm() {
  const [uploadType, setUploadType] = useState<UploadType>("photo");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<MemoryCategory>("Favorite Moments");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");

    try {
      const formData = new FormData();
      formData.set("type", uploadType);
      formData.set("kind", uploadType);
      formData.set("title", title || (uploadType === "photo" ? "Untitled Photo" : "Untitled Video"));
      formData.set("date", date || new Date().toISOString().slice(0, 10));
      formData.set("category", category);
      formData.set("description", description || (uploadType === "photo" ? "一段新的照片回忆。" : "一段新的视频回忆。"));
      formData.set("featured", String(featured));

      if (uploadType === "photo" && photoFile) {
        formData.set("photo", photoFile);
      }
      if (uploadType === "video") {
        if (videoFile) {
          formData.set("video", videoFile);
        }
      }

      await uploadMemory(formData);

      setStatus("Saved. This moment is now part of your archive.");
      setTitle("");
      setDate("");
      setDescription("");
      setPhotoFile(null);
      setVideoFile(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save this moment right now.");
    }
  }

  return (
    <div className="mt-12 grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
      <aside className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/[0.075] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,196,204,0.22),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]" />
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/14 bg-white/10">
            <Sparkles className="h-6 w-6 text-[#f2c4cc]" />
          </div>
          <h2 className="mt-8 text-4xl font-semibold tracking-tight">Save This Moment</h2>
          <p className="mt-5 max-w-md leading-8 text-white/60">
            给每一张照片、每一段视频、每一次心动，都留一个体面而温柔的位置。
          </p>
          <div className="mt-8 grid gap-3">
            {["A quiet date", "A faraway trip", "A tiny everyday miracle"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-black/16 px-5 py-4 text-sm text-white/64">
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/[0.08] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_48%),radial-gradient(circle_at_90%_0%,rgba(242,196,204,0.16),transparent_28%)]" />
        <div className="relative grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-black/18 p-2">
          {[
            { id: "photo" as const, label: "Photo", icon: ImagePlus },
            { id: "video" as const, label: "Video", icon: Video },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setUploadType(item.id)}
                type="button"
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  uploadType === item.id ? "bg-[#f2c4cc] text-[#241116]" : "text-white/58 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="标题">
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="field" placeholder="Memory title" />
          </Field>
          <Field label="日期">
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="field" />
          </Field>
          <Field label="分类">
            <select value={category} onChange={(event) => setCategory(event.target.value as MemoryCategory)} className="field">
              {uploadCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="是否精选">
            <label className="flex h-13 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white/72">
              <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
              Featured on home
            </label>
          </Field>
        </div>

        <Field label="描述" className="relative mt-5">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="field min-h-32 py-4"
            placeholder="Write a short description..."
          />
        </Field>

        <div className="relative">
          {uploadType === "photo" ? (
          <Field label="照片文件" className="mt-5">
            <input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)} className="file-field" />
          </Field>
        ) : (
          <div className="mt-5">
            <Field label="视频文件">
              <input type="file" accept="video/*" onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)} className="file-field" />
            </Field>
          </div>
        )}
        </div>

        <button
          type="submit"
          className="luxury-button relative mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#f2c4cc] px-5 text-sm font-bold uppercase tracking-[0.2em] text-[#241116] shadow-[0_18px_55px_rgba(242,196,204,0.25)] transition hover:bg-white"
        >
          <UploadCloud className="h-4 w-4" />
          Save Memory
        </button>

        {status ? (
          <p className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/16 px-4 py-3 text-sm text-white/64">
            <CheckCircle2 className="h-4 w-4 text-[#f2c4cc]" />
            {status}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-white/64">{label}</span>
      {children}
    </label>
  );
}
