"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Film,
  Heart,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteShell } from "@/components/SiteShell";
import { categories, type MemoryCategory } from "@/data/memories";

type ModuleKey =
  | "photos"
  | "videos"
  | "timeline"
  | "letters"
  | "special_dates"
  | "secret_cards"
  | "home_images"
  | "story_assets"
  | "story_chapters";

type FieldType = "text" | "date" | "textarea" | "select" | "number" | "checkbox" | "file";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  accept?: string;
  full?: boolean;
};

type ModuleConfig = {
  key: ModuleKey;
  label: string;
  description: string;
  icon: typeof ImagePlus;
  fields: FieldConfig[];
  defaults: Record<string, string | boolean>;
  note?: string;
};

type AdminItem = Record<string, string | number | boolean | null | undefined> & { id: string };

const memoryCategories = categories.filter((category): category is MemoryCategory => category !== "All");
const slots = ["hero_left", "hero_right", "hero_wide"];
const storySlots = ["main"];

const commonFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "A beautiful title" },
  { name: "date", label: "Date", type: "date" },
  { name: "sortOrder", label: "Sort order", type: "number", placeholder: "0" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "pinned", label: "Pinned", type: "checkbox" },
];

const modules: ModuleConfig[] = [
  {
    key: "photos",
    label: "Photos",
    description: "Manage every image in the gallery and featured home moments.",
    icon: ImagePlus,
    defaults: { category: "Favorite Moments", height: "medium", featured: true, pinned: false },
    fields: [
      ...commonFields,
      { name: "category", label: "Category", type: "select", options: memoryCategories },
      { name: "height", label: "Masonry height", type: "select", options: ["small", "medium", "large"] },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "file", label: "Photo file", type: "file", accept: "image/*", full: true },
    ],
  },
  {
    key: "videos",
    label: "Videos",
    description: "Upload videos and edit the cards shown in Video Memories.",
    icon: Film,
    defaults: { category: "Favorite Moments", featured: true, pinned: false },
    fields: [
      ...commonFields,
      { name: "category", label: "Category", type: "select", options: memoryCategories },
      { name: "externalUrl", label: "External URL", type: "text", placeholder: "Optional video link", full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "file", label: "Video file", type: "file", accept: "video/*", full: true },
    ],
  },
  {
    key: "timeline",
    label: "Timeline",
    description: "Edit important dates, chapters, images, and categories.",
    icon: CalendarDays,
    defaults: { accent: "Rose", featured: false, pinned: false },
    fields: [
      ...commonFields,
      { name: "category", label: "Category", type: "text", placeholder: "Trip, Anniversary..." },
      { name: "accent", label: "Accent", type: "text", placeholder: "Rose" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "file", label: "Optional image", type: "file", accept: "image/*", full: true },
    ],
  },
  {
    key: "letters",
    label: "Letters",
    description: "Write, pin, and arrange love letters or small notes.",
    icon: Heart,
    defaults: { author: "Me", featured: true, pinned: false },
    fields: [
      ...commonFields,
      { name: "author", label: "From", type: "text", placeholder: "Name or nickname" },
      { name: "content", label: "Letter content", type: "textarea", full: true },
    ],
  },
  {
    key: "special_dates",
    label: "Special Dates",
    description: "Keep anniversaries and meaningful countdown moments fresh.",
    icon: Star,
    defaults: { label: "纪念日", featured: false, pinned: false },
    fields: [
      ...commonFields,
      { name: "label", label: "Label", type: "text", placeholder: "Anniversary" },
      { name: "description", label: "Description", type: "textarea", full: true },
    ],
  },
  {
    key: "secret_cards",
    label: "Secret Room",
    description: "Manage private cards, promises, plans, and hidden memories.",
    icon: LockKeyhole,
    defaults: { category: "Private", featured: false, pinned: false },
    fields: [
      ...commonFields,
      { name: "category", label: "Category", type: "text", placeholder: "Promise, Dream, Plan..." },
      { name: "content", label: "Private content", type: "textarea", full: true },
      { name: "file", label: "Optional image", type: "file", accept: "image/*", full: true },
    ],
  },
  {
    key: "home_images",
    label: "Home Images",
    description: "Choose the three hero images shown on the Home page.",
    icon: LayoutDashboard,
    defaults: { slot: "hero_left", pinned: true },
    note: "hero_left: 首页左上竖图；hero_right: 首页右上竖图；hero_wide: 首页下方横图。",
    fields: [
      { name: "title", label: "Title", type: "text", placeholder: "Home hero image" },
      { name: "slot", label: "Home position", type: "select", options: slots },
      { name: "sortOrder", label: "Sort order", type: "number", placeholder: "0" },
      { name: "pinned", label: "Pinned", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "file", label: "Image file", type: "file", accept: "image/*", full: true },
    ],
  },
  {
    key: "story_assets",
    label: "Our Story Image",
    description: "Replace the large left image on the Our Story page.",
    icon: Sparkles,
    defaults: { slot: "main", pinned: true },
    note: "slot main 会显示在 Our Story 页面左侧的大图位置。",
    fields: [
      { name: "title", label: "Title", type: "text", placeholder: "Our story photo" },
      { name: "slot", label: "Story position", type: "select", options: storySlots },
      { name: "sortOrder", label: "Sort order", type: "number", placeholder: "0" },
      { name: "pinned", label: "Pinned", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "file", label: "Image file", type: "file", accept: "image/*", full: true },
    ],
  },
  {
    key: "story_chapters",
    label: "Story Chapters",
    description: "Create and reorder unlimited chapters for Our Story.",
    icon: Edit3,
    defaults: { eyebrow: "Chapter", pinned: false },
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text", placeholder: "Chapter 01" },
      { name: "title", label: "Title", type: "text", placeholder: "A chapter title" },
      { name: "sortOrder", label: "Sort order", type: "number", placeholder: "0" },
      { name: "pinned", label: "Pinned", type: "checkbox" },
      { name: "content", label: "Chapter content", type: "textarea", full: true },
      { name: "file", label: "Optional image", type: "file", accept: "image/*", full: true },
    ],
  },
];

function initialForm(module: ModuleConfig) {
  const next: Record<string, string | boolean> = {};
  module.fields.forEach((field) => {
    if (field.type === "checkbox") next[field.name] = Boolean(module.defaults[field.name]);
    else next[field.name] = String(module.defaults[field.name] ?? "");
  });
  return next;
}

export default function AdminPage() {
  return (
    <SiteShell>
      <PageTransition>
        <SectionHeader
          eyebrow="Memory Atelier"
          title="Save This Moment"
          description="把照片、视频、日期、情书和私密心事，都整理进只属于你们的纪念馆。"
        />
        <AdminStudio />
      </PageTransition>
    </SiteShell>
  );
}

function AdminStudio() {
  const [activeKey, setActiveKey] = useState<ModuleKey>("photos");
  const [items, setItems] = useState<AdminItem[]>([]);
  const [form, setForm] = useState<Record<string, string | boolean>>(() => initialForm(modules[0]));
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<AdminItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const active = useMemo(() => modules.find((module) => module.key === activeKey) ?? modules[0], [activeKey]);

  const resetForm = useCallback(() => {
    setForm(initialForm(active));
    setFile(null);
    setEditing(null);
  }, [active]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch(`/api/admin/content?table=${active.key}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to load content.");
      setItems(data.items ?? []);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load content.");
    } finally {
      setLoading(false);
    }
  }, [active.key]);

  useEffect(() => {
    void Promise.resolve().then(loadItems);
  }, [loadItems]);

  function changeModule(module: ModuleConfig) {
    setActiveKey(module.key);
    setForm(initialForm(module));
    setFile(null);
    setEditing(null);
    setItems([]);
    setStatus("");
  }

  function setField(name: string, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function beginEdit(item: AdminItem) {
    const next: Record<string, string | boolean> = {};
    active.fields.forEach((field) => {
      if (field.type === "file") return;
      const raw = item[field.name] ?? item[toSnake(field.name)] ?? "";
      next[field.name] = field.type === "checkbox" ? Boolean(raw) : String(raw ?? "");
    });
    setForm(next);
    setFile(null);
    setEditing(item);
    setStatus("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(editing ? "Updating..." : "Saving...");

    try {
      const formData = new FormData();
      formData.set("table", active.key);
      if (editing) formData.set("id", editing.id);
      Object.entries(form).forEach(([key, value]) => formData.set(key, String(value)));
      if (editing && !file) addExistingMedia(active.key, editing, formData);
      if (file) formData.set("file", file, file.name);

      const response = await fetch("/api/admin/content", {
        method: editing ? "PATCH" : "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to save content.");

      setStatus(editing ? "Updated beautifully." : "Saved beautifully.");
      resetForm();
      await loadItems();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save content.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: AdminItem) {
    if (!window.confirm(`Delete "${String(item.title ?? "this item")}"?`)) return;
    setStatus("Deleting...");
    try {
      const response = await fetch(`/api/admin/content?table=${active.key}&id=${item.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to delete content.");
      setStatus("Deleted.");
      await loadItems();
      if (editing?.id === item.id) resetForm();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete content.");
    }
  }

  return (
    <div className="mt-12 grid gap-7 xl:grid-cols-[300px_1fr]">
      <aside className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.07] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(242,196,204,0.2),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]" />
        <div className="relative grid gap-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const activeTab = module.key === active.key;
            return (
              <button
                key={module.key}
                type="button"
                onClick={() => changeModule(module)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeTab ? "bg-[#f2c4cc] text-[#241116] shadow-[0_16px_45px_rgba(242,196,204,0.22)]" : "text-white/62 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{module.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[34px] border border-white/12 bg-white/[0.08] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(242,196,204,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f2c4cc]">{editing ? "Editing" : "New Entry"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{active.label}</h2>
            <p className="mt-3 leading-7 text-white/58">{active.description}</p>
            {active.note ? <p className="mt-4 rounded-2xl border border-white/10 bg-black/16 px-4 py-3 text-sm leading-6 text-white/58">{active.note}</p> : null}
          </div>

          <div className="relative mt-7 grid gap-5 sm:grid-cols-2">
            {active.fields.map((field) => (
              <AdminField
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={(value) => setField(field.name, value)}
                onFile={setFile}
              />
            ))}
          </div>

          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="luxury-button flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f2c4cc] px-5 text-sm font-bold uppercase tracking-[0.2em] text-[#241116] shadow-[0_18px_55px_rgba(242,196,204,0.25)] transition hover:bg-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editing ? "Update" : "Save"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={resetForm}
                className="h-13 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {status ? <p className="relative mt-5 rounded-2xl border border-white/10 bg-black/16 px-4 py-3 text-sm text-white/64">{status}</p> : null}
        </form>

        <div className="relative overflow-hidden rounded-[34px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.1),transparent_32%)]" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/38">Content</p>
              <h3 className="mt-2 text-2xl font-semibold">{active.label}</h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>

          <div className="relative mt-6 grid gap-3">
            {loading ? (
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/16 p-5 text-white/58">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading memories...
              </div>
            ) : items.length ? (
              items.map((item) => (
                <article key={item.id} className="rounded-3xl border border-white/10 bg-black/16 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-semibold">{String(item.title ?? item.eyebrow ?? "Untitled")}</h4>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/34">
                        {[item.date, item.category, item.slot, item.label].filter(Boolean).join(" / ") || "Memory item"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => beginEdit(item)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/64 transition hover:bg-white/10 hover:text-white"
                        aria-label="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(item)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/64 transition hover:bg-white/10 hover:text-white"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/48">
                    {item.featured ? <span className="rounded-full bg-white/10 px-3 py-1">Featured</span> : null}
                    {item.pinned ? <span className="rounded-full bg-white/10 px-3 py-1">Pinned</span> : null}
                    {item.sort_order !== null && item.sort_order !== undefined ? <span className="rounded-full bg-white/10 px-3 py-1">Sort {String(item.sort_order)}</span> : null}
                    {active.key === "videos" ? (
                      <>
                        <span className={`rounded-full px-3 py-1 ${item.video_src ? "bg-[#f2c4cc]/18 text-[#f2c4cc]" : "bg-white/10 text-white/42"}`}>
                          video_src {item.video_src ? "ready" : "empty"}
                        </span>
                        {item.external_url ? <span className="rounded-full bg-white/10 px-3 py-1">External link</span> : null}
                      </>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-white/10 bg-black/16 p-6 text-sm leading-7 text-white/54">
                No cloud content yet. Add the first memory here.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminField({
  field,
  value,
  onChange,
  onFile,
}: {
  field: FieldConfig;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
  onFile: (file: File | null) => void;
}) {
  const className = field.full ? "sm:col-span-2" : "";

  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-white/64">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className="field min-h-32 py-4" value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : field.type === "select" ? (
        <select className="field" value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "checkbox" ? (
        <span className="flex h-13 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white/72">
          <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
          Keep this item highlighted
        </span>
      ) : field.type === "file" ? (
        <input
          type="file"
          accept={field.accept}
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            console.log("[admin] selected file:", selected ? { name: selected.name, size: selected.size, type: selected.type } : null);
            onFile(selected);
          }}
          className="file-field"
        />
      ) : (
        <input
          type={field.type}
          className="field"
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function toSnake(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function addExistingMedia(table: ModuleKey, item: AdminItem, formData: FormData) {
  if (table === "videos" && item.video_src) formData.set("videoSrc", String(item.video_src));
  if (table === "photos" && item.src) formData.set("src", String(item.src));
  if ((table === "timeline" || table === "secret_cards" || table === "home_images" || table === "story_assets" || table === "story_chapters") && item.image) {
    formData.set("image", String(item.image));
  }
}
