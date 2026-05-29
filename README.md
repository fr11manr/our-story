# Our Story

一个可长期维护、可部署上线的情侣纪念网站。网站使用 Next.js、TypeScript、Tailwind CSS、Framer Motion、lucide-react 和 Supabase；访问主站需要情侣密码，进入 `/admin` 需要单独管理密码。

## 本地启动

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。检查生产构建：

```bash
npm run lint
npm run build
```

## 环境变量

在项目根目录创建 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service_role key

SITE_PASSWORD=情侣访问密码
ADMIN_PASSWORD=管理后台密码
```

`SITE_PASSWORD` 用于进入主站，`ADMIN_PASSWORD` 用于进入 `/admin`。修改密码后重启开发服务器或重新部署 Vercel。

## Supabase 表

在 Supabase SQL Editor 执行：

```sql
create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  category text not null default 'Favorite Moments',
  description text not null default '',
  src text not null,
  featured boolean not null default false,
  pinned boolean not null default false,
  sort_order integer default 0,
  height text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  category text not null default 'Favorite Moments',
  description text not null default '',
  video_src text,
  external_url text,
  featured boolean not null default false,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  description text not null default '',
  image text,
  category text,
  accent text default 'Rose',
  featured boolean not null default false,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  author text not null default 'Me',
  content text not null default '',
  featured boolean not null default false,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.special_dates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null default current_date,
  label text not null default '纪念日',
  description text,
  featured boolean not null default false,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.secret_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  category text not null default 'Private',
  date date,
  image text,
  featured boolean not null default false,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.home_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Home image',
  image text not null,
  slot text not null,
  description text,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.story_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Our story image',
  image text not null,
  slot text not null default 'main',
  description text,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.story_chapters (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'Chapter',
  title text not null,
  content text not null default '',
  image text,
  pinned boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);
```

如果你之前已经创建过旧表，可以执行这些补充字段：

```sql
alter table public.photos add column if not exists pinned boolean not null default false;
alter table public.photos add column if not exists sort_order integer default 0;

alter table public.videos add column if not exists pinned boolean not null default false;
alter table public.videos add column if not exists sort_order integer default 0;
alter table public.videos add column if not exists external_url text;
alter table public.videos alter column video_src drop not null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'cover'
  ) then
    alter table public.videos alter column cover drop not null;
  end if;
end $$;

alter table public.timeline add column if not exists image text;
alter table public.timeline add column if not exists category text;
alter table public.timeline add column if not exists featured boolean not null default false;
alter table public.timeline add column if not exists pinned boolean not null default false;
alter table public.timeline add column if not exists sort_order integer default 0;
```

## RLS 策略

前台读取通过服务端 API 完成，后台写入通过 `SUPABASE_SERVICE_ROLE_KEY` 完成。推荐开启 RLS，并只允许匿名读取：

```sql
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.timeline enable row level security;
alter table public.letters enable row level security;
alter table public.special_dates enable row level security;
alter table public.secret_cards enable row level security;
alter table public.home_images enable row level security;
alter table public.story_assets enable row level security;
alter table public.story_chapters enable row level security;

create policy "Public read photos" on public.photos for select to anon using (true);
create policy "Public read videos" on public.videos for select to anon using (true);
create policy "Public read timeline" on public.timeline for select to anon using (true);
create policy "Public read letters" on public.letters for select to anon using (true);
create policy "Public read special_dates" on public.special_dates for select to anon using (true);
create policy "Public read secret_cards" on public.secret_cards for select to anon using (true);
create policy "Public read home_images" on public.home_images for select to anon using (true);
create policy "Public read story_assets" on public.story_assets for select to anon using (true);
create policy "Public read story_chapters" on public.story_chapters for select to anon using (true);
```

不要给 `anon` 开 insert/update/delete。Admin 的新增、编辑、删除都由 Next.js API 使用 service role key 完成。

## Storage Bucket

在 Supabase Storage 创建两个 public bucket：

- `photos`
- `videos`

照片、Timeline 图片、Secret Room 图片、Home 图片、Our Story 图片都进入 `photos` bucket。视频进入 `videos` bucket。视频卡片直接用 `video_src` 的视频第一帧做预览，不需要单独封面图。

## Admin 内容维护

进入 `/admin` 后输入管理密码。后台按 tab 分区：

- `Photos`：管理 Gallery 照片和首页精选照片。
- `Videos`：管理 Video Memories 视频。
- `Timeline`：管理时间线标题、日期、描述、分类和可选图片。
- `Letters`：管理情书和留言。
- `Special Dates`：管理纪念日，前台会自动计算天数。
- `Secret Room`：管理私密房间卡片。
- `Home Images`：管理首页 Hero 三张图。
- `Our Story Image`：管理 Our Story 页面左侧大图。
- `Story Chapters`：管理 Our Story 页面章节。

Home 图片位置：

- `hero_left`：首页 Hero 左上竖图。
- `hero_right`：首页 Hero 右上竖图。
- `hero_wide`：首页 Hero 下方横图。

Our Story 图片位置：

- `main`：Our Story 页面左侧大图。

每条内容都支持新增、编辑、删除、排序、Featured、Pinned。排序优先看 `pinned`，然后看 `sort_order`，再看日期或创建时间。

## 替换默认内容

当 Supabase 未配置或云端表为空时，页面会使用 `src/data/memories.ts` 的默认内容作为占位展示。长期维护时建议通过 Admin 添加真实内容；云端有数据后，Gallery、Video Memories、Timeline、Letters、Special Dates、Secret Room、Home Hero、Our Story 图片和章节都会读取 Supabase。

默认静态图片在 `public/photos`，可以保留作为空数据时的优雅默认图。

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 创建 Next.js 项目。
3. 在 Vercel Environment Variables 添加：

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SITE_PASSWORD
ADMIN_PASSWORD
```

4. 部署。线上访问会先进入情侣密码页，`/admin` 会再要求管理密码。

## 关键文件

```text
src/proxy.ts                          # 访问保护
src/app/unlock/page.tsx               # 主站密码页
src/app/admin/unlock/page.tsx         # Admin 密码页
src/app/api/memories/route.ts         # 前台读取 Supabase 内容
src/app/api/admin/content/route.ts    # Admin CRUD 和 Storage 上传
src/app/admin/page.tsx                # 内容管理后台
src/lib/supabase.ts                   # Supabase client 和数据映射
src/data/memories.ts                  # 空数据时的默认内容
```
