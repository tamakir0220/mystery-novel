import { notFound } from "next/navigation";
import { getAllNovels } from "@/lib/novels";
import { getAllChapters, getChapter } from "@/lib/chapters";
import BookReader from "@/components/BookReader";

export const dynamicParams = false;

export async function generateStaticParams() {
  const novels = getAllNovels();
  const params: { novelSlug: string; chapterSlug: string }[] = [];

  for (const novel of novels) {
    const chapters = getAllChapters(novel.slug);
    for (const chapter of chapters) {
      params.push({
        novelSlug: novel.slug,
        chapterSlug: chapter.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ novelSlug: string; chapterSlug: string }>;
}) {
  const { novelSlug, chapterSlug } = await params;
  const chapter = await getChapter(novelSlug, chapterSlug);
  if (!chapter) return {};
  return {
    title: chapter.meta.title,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ novelSlug: string; chapterSlug: string }>;
}) {
  const { novelSlug, chapterSlug } = await params;
  const chapter = await getChapter(novelSlug, chapterSlug);

  if (!chapter) {
    notFound();
  }

  return (
    <BookReader
      pages={chapter.pages}
      chapterTitle={chapter.meta.title}
      novelSlug={chapter.novelSlug}
      chapterSlug={chapter.meta.slug}
      prevChapter={chapter.prevChapter}
      nextChapter={chapter.nextChapter}
    />
  );
}
