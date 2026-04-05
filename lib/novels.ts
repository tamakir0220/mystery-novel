import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { NovelMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "novels");

export function getAllNovels(): NovelMeta[] {
  const dirs = fs.readdirSync(CONTENT_DIR).filter((name) => {
    const fullPath = path.join(CONTENT_DIR, name);
    return (
      fs.statSync(fullPath).isDirectory() &&
      fs.existsSync(path.join(fullPath, "novel.md"))
    );
  });

  const novels = dirs.map((dir) => {
    const filePath = path.join(CONTENT_DIR, dir, "novel.md");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return {
      title: data.title,
      author: data.author,
      slug: data.slug || dir,
      description: data.description,
      coverImage: data.coverImage,
      genre: data.genre,
      status: data.status,
      order: data.order ?? 0,
    } as NovelMeta;
  });

  return novels.sort((a, b) => a.order - b.order);
}

export function getNovel(slug: string): NovelMeta | null {
  const filePath = path.join(CONTENT_DIR, slug, "novel.md");
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);
  return {
    title: data.title,
    author: data.author,
    slug: data.slug || slug,
    description: data.description,
    coverImage: data.coverImage,
    genre: data.genre,
    status: data.status,
    order: data.order ?? 0,
  } as NovelMeta;
}
