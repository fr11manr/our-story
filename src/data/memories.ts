export type MemoryCategory =
  | "Dates"
  | "Travel"
  | "Daily Life"
  | "Food"
  | "Favorite Moments";

export type PhotoMemory = {
  id: string;
  title: string;
  date: string;
  category: MemoryCategory;
  description: string;
  src: string;
  featured: boolean;
  height: "short" | "medium" | "tall";
};

export type VideoMemory = {
  id: string;
  title: string;
  date: string;
  category: MemoryCategory;
  description: string;
  cover?: string;
  videoSrc?: string;
  externalUrl?: string;
  featured: boolean;
};

export type TimelineMemory = {
  id: string;
  date: string;
  title: string;
  description: string;
  accent: string;
};

export type Letter = {
  id: string;
  title: string;
  date: string;
  body: string;
  from: string;
};

export type SpecialDate = {
  id: string;
  title: string;
  date: string;
  note: string;
};

export const categories: Array<"All" | MemoryCategory> = [
  "All",
  "Dates",
  "Travel",
  "Daily Life",
  "Food",
  "Favorite Moments",
];

export const photos: PhotoMemory[] = [
  {
    id: "p-01",
    title: "First Promise",
    date: "2024-04-15",
    category: "Favorite Moments",
    description: "把最想收藏的第一张合照放在这里。",
    src: "/photos/couple-1.svg",
    featured: true,
    height: "tall",
  },
  {
    id: "p-02",
    title: "Soft Afternoon",
    date: "2024-05-20",
    category: "Dates",
    description: "一次普通但很温柔的约会。",
    src: "/photos/gallery-1.svg",
    featured: true,
    height: "medium",
  },
  {
    id: "p-03",
    title: "Weekend Away",
    date: "2024-06-01",
    category: "Travel",
    description: "旅行路上的小片段。",
    src: "/photos/gallery-2.svg",
    featured: false,
    height: "tall",
  },
  {
    id: "p-04",
    title: "Daily Spark",
    date: "2024-07-08",
    category: "Daily Life",
    description: "日常里闪闪发光的一秒。",
    src: "/photos/gallery-3.svg",
    featured: false,
    height: "short",
  },
  {
    id: "p-05",
    title: "Dinner For Two",
    date: "2024-08-18",
    category: "Food",
    description: "一起吃饭也是认真相爱的证据。",
    src: "/photos/gallery-4.svg",
    featured: true,
    height: "medium",
  },
  {
    id: "p-06",
    title: "City Lights",
    date: "2024-10-02",
    category: "Travel",
    description: "夜色和你都很好看。",
    src: "/photos/gallery-5.svg",
    featured: false,
    height: "tall",
  },
  {
    id: "p-07",
    title: "Just Us",
    date: "2024-11-11",
    category: "Favorite Moments",
    description: "留给只属于你们的瞬间。",
    src: "/photos/gallery-6.svg",
    featured: true,
    height: "medium",
  },
  {
    id: "p-08",
    title: "Tiny Ritual",
    date: "2025-01-03",
    category: "Daily Life",
    description: "每天重复的小事，后来都变成浪漫。",
    src: "/photos/couple-2.svg",
    featured: false,
    height: "short",
  },
  {
    id: "p-09",
    title: "Story Corner",
    date: "2025-02-14",
    category: "Dates",
    description: "把情人节的温柔留在这里。",
    src: "/photos/story.svg",
    featured: true,
    height: "tall",
  },
];

export const videos: VideoMemory[] = [
  {
    id: "v-01",
    title: "A Day In Motion",
    date: "2024-06-01",
    category: "Travel",
    description: "一段在路上的影像，适合反复回看。",
    videoSrc: "",
    featured: true,
  },
  {
    id: "v-02",
    title: "Dinner Clip",
    date: "2024-08-18",
    category: "Food",
    description: "也可以使用外部链接，比如云盘、YouTube、B站等。",
    externalUrl: "https://example.com",
    featured: true,
  },
  {
    id: "v-03",
    title: "Countdown",
    date: "2024-12-31",
    category: "Favorite Moments",
    description: "这里预留跨年或周年视频。",
    videoSrc: "",
    featured: false,
  },
];

export const timeline: TimelineMemory[] = [
  {
    id: "t-01",
    date: "2024-04-15",
    title: "The Day We Chose Each Other",
    description: "把你们最重要的开始写在这里。",
    accent: "Rose",
  },
  {
    id: "t-02",
    date: "2024-06-01",
    title: "First Trip",
    description: "第一次一起去新的地方，世界忽然变得更大也更亲密。",
    accent: "Gold",
  },
  {
    id: "t-03",
    date: "2024-12-31",
    title: "Countdown Together",
    description: "一起倒数，认真许愿，把下一年也交给彼此。",
    accent: "Violet",
  },
  {
    id: "t-04",
    date: "2025-04-15",
    title: "One Year Anniversary",
    description: "从心动到笃定，每一天都不是理所当然。",
    accent: "Pearl",
  },
];

export const letters: Letter[] = [
  {
    id: "l-01",
    title: "To The One I Keep Choosing",
    date: "2025-04-15",
    from: "Me",
    body: "谢谢你把很多平凡日子变得很亮。这里以后可以写成长情书、留言板，或只给对方看的悄悄话。",
  },
  {
    id: "l-02",
    title: "A Small Note",
    date: "2025-05-20",
    from: "Us",
    body: "愿我们一直保留认真表达爱的能力，也保留一起大笑的能力。",
  },
];

export const specialDates: SpecialDate[] = [
  {
    id: "d-01",
    title: "Together Since",
    date: "2024-04-15",
    note: "恋爱纪念日",
  },
  {
    id: "d-02",
    title: "First Trip",
    date: "2024-06-01",
    note: "第一次旅行",
  },
  {
    id: "d-03",
    title: "Anniversary",
    date: "2025-04-15",
    note: "周年纪念",
  },
];
