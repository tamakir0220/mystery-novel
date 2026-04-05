import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ChapterMeta, ChapterData } from "./types";
import { markdownToHtml } from "./markdown";
import { splitIntoPages } from "./pageSplitter";

const CONTENT_DIR = path.join(process.cwd(), "content", "novels");

function getChaptersDir(novelSlug: string): string {
  return path.join(CONTENT_DIR, novelSlug, "chapters");
}

export function getAllChapters(novelSlug: string): ChapterMeta[] {
  const dir = getChaptersDir(novelSlug);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const chapters = files.map((filename) => {
    const filePath = path.join(dir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const slug = filename.replace(/\.md$/, "");
    return {
      title: data.title,
      chapterNumber: data.chapterNumber ?? 0,
      order: data.order ?? 0,
      slug,
    } as ChapterMeta;
  });

  return chapters.sort((a, b) => a.order - b.order);
}

export async function getChapter(
  novelSlug: string,
  chapterSlug: string
): Promise<ChapterData | null> {
  const filePath = path.join(getChaptersDir(novelSlug), `${chapterSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const html = await markdownToHtml(content);
  const pages = splitIntoPages(html);

  const allChapters = getAllChapters(novelSlug);
  const currentIndex = allChapters.findIndex((c) => c.slug === chapterSlug);

  return {
    meta: {
      title: data.title,
      chapterNumber: data.chapterNumber ?? 0,
      order: data.order ?? 0,
      slug: chapterSlug,
    },
    pages,
    novelSlug,
    prevChapter: currentIndex > 0 ? allChapters[currentIndex - 1] : null,
    nextChapter:
      currentIndex < allChapters.length - 1
        ? allChapters[currentIndex + 1]
        : null,
  };
}
