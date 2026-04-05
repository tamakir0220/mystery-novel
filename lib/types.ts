export interface NovelMeta {
  title: string;
  author: string;
  slug: string;
  description: string;
  coverImage: string;
  genre: string;
  status: "連載中" | "完結";
  order: number;
}

export interface ChapterMeta {
  title: string;
  chapterNumber: number;
  order: number;
  slug: string; // derived from filename
}

export interface ChapterData {
  meta: ChapterMeta;
  pages: PageData[];
  novelSlug: string;
  prevChapter: ChapterMeta | null;
  nextChapter: ChapterMeta | null;
}

export interface PageData {
  html: string;
  hasIllustration: boolean;
  isFullPageIllustration: boolean;
}
