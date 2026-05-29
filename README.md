# Our Story

一个可部署上线的情侣纪念网站，使用 Next.js、TypeScript、Tailwind CSS、Framer Motion、lucide-react 和 Supabase。

网站访问使用情侣密码，登录状态保存在 httpOnly cookie 中；Admin 页面使用单独的管理密码。照片、视频文件保存在 Supabase Storage，标题、日期、分类、描述、是否精选等元数据保存在 Supabase Database。

## 1. 创建 Supabase 项目

1. 打开 [Supabase](https://supabase.com)。
2. 创建一个新项目。
3. 进入 Project Settings -> API，复制：
   - Project URL
   - anon public key
   - service_role key

注意：`service_role key` 只放在服务端环境变量里，不要暴露到浏览器。

## 2. 创建数据库表

进入 Supabase 项目的 SQL Editor，执行下面的 SQL：

```sql
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  category text not null,
  description text not null default '',
  src text not null,
  featured boolean not null default false,
  height text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  category text not null,
  description text not null default '',
  video_src text not null,
  external_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  description text not null default '',
  accent text default 'Rose',
  created_at timestamptz not null default now()
);
```

可选：插入几条初始时间线数据：

```sql
insert into public.timeline (title, date, description, accent)
values
  ('The Day We Chose Each Other', '2024-04-15', '把你们最重要的开始写在这里。', 'Rose'),
  ('First Trip', '2024-06-01', '第一次一起去新的地方。', 'Gold'),
  ('One Year Anniversary', '2025-04-15', '从心动到笃定，每一天都值得被记住。', 'Pearl');
```

## 3. 设置 Row Level Security

本项目通过服务端 API 读取和写入 Supabase。为了让网站可读公开素材，但上传必须走服务端管理密钥，推荐这样设置：

```sql
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.timeline enable row level security;

create policy "Public read photos"
on public.photos for select
to anon
using (true);

create policy "Public read videos"
on public.videos for select
to anon
using (true);

create policy "Public read timeline"
on public.timeline for select
to anon
using (true);
```

不要给 `anon` 添加 insert/update/delete policy。上传由 Next.js API 使用 `SUPABASE_SERVICE_ROLE_KEY` 完成。

## 4. 创建 Storage Bucket

进入 Supabase Storage，创建两个 bucket：

- `photos`
- `videos`

为了让前台页面能直接显示图片和播放视频，建议把这两个 bucket 设置为 Public。

如果你想使用私有 bucket，需要改造图片和视频 URL 的生成方式，改为 signed URL。

如果你之前已经创建过带 `cover` 字段的视频表，可以执行：

```sql
alter table public.videos alter column cover drop not null; -- only if the column exists
alter table public.videos alter column video_src set not null;
```

新版本的视频卡片直接使用 `video_src` 的第一帧做封面，不再需要单独上传封面图。

## 5. 配置环境变量

在项目根目录创建 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service_role key

SITE_PASSWORD=情侣访问密码
ADMIN_PASSWORD=管理上传密码
```

示例：

```bash
SITE_PASSWORD=LoveR0415
ADMIN_PASSWORD=AdminR0415
```

`SITE_PASSWORD` 用于进入主站，`ADMIN_PASSWORD` 用于进入 `/admin` 上传页面。

## 6. 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

检查构建：

```bash
npm run build
```

代码检查：

```bash
npm run lint
```

## 7. 上传照片和视频

1. 打开 `http://localhost:3000`，输入情侣密码。
2. 进入 `/admin`。
3. 输入管理密码。
4. 选择 `Photo` 或 `Video`。
5. 填写标题、日期、分类、描述，选择是否精选。
6. 上传照片；视频只需要上传视频文件。
7. 点击 `Save Memory`。

上传成功后：

- 图片文件进入 Supabase Storage 的 `photos` bucket
- 视频文件进入 Supabase Storage 的 `videos` bucket
- 元数据进入 Supabase Database 的 `photos` 或 `videos` 表
- Gallery、Video Memories、Home 页面会自动读取并展示
- Video Memories 会直接用视频第一帧做预览，hover 时静音播放，点击后弹窗完整播放

## 8. 替换默认内容

默认内容在：

```text
src/data/memories.ts
```

当 Supabase 没有配置或云端表为空时，网站会使用这些默认内容作为只读展示。

可以修改：

- `photos`：默认照片
- `videos`：默认视频
- `timeline`：默认时间线
- `letters`：情书/留言
- `specialDates`：纪念日
- `categories`：分类

默认图片在：

```text
public/photos
```

## 9. 部署到 Vercel

1. 将项目推送到 GitHub。
2. 打开 [Vercel](https://vercel.com)。
3. New Project，选择这个 GitHub 仓库。
4. Framework Preset 选择 Next.js。
5. 在 Environment Variables 中添加：

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SITE_PASSWORD
ADMIN_PASSWORD
```

6. 点击 Deploy。

部署完成后，任何人打开线上网址都会先进入密码页。输入情侣密码后才能浏览内容；进入 `/admin` 时还需要管理密码。

## 10. 重要文件

```text
middleware.ts                         # 访问保护和路由拦截
src/app/unlock/page.tsx               # 主站密码页
src/app/admin/unlock/page.tsx         # Admin 密码页
src/app/api/auth/login/route.ts       # 主站登录 API
src/app/api/auth/admin-login/route.ts # Admin 登录 API
src/app/api/auth/logout/route.ts      # 退出登录 API
src/app/api/memories/route.ts         # 从 Supabase 读取照片/视频/时间线
src/app/api/uploads/route.ts          # 上传到 Supabase Storage 并写入数据库
src/lib/supabase.ts                   # Supabase client 和数据映射
src/lib/auth.ts                       # cookie 名称、密码读取和 cookie 配置
```
