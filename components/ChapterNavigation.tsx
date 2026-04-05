"use client";

import Link from "next/link";
import type { ChapterMeta } from "@/lib/types";

interface ChapterNavigationProps {
  novelSlug: string;
  prevChapter: ChapterMeta | null;
  nextChapter: ChapterMeta | null;
}

export default function ChapterNavigation({
  novelSlug,
  prevChapter,
  nextChapter,
}: ChapterNavigationProps) {
  return (
    <div className="flex justify-between items-center max-w-[40rem] mx-auto mt-2 text-sm">
      {prevChapter ? (
        <Link
          href={`/novels/${novelSlug}/chapters/${prevChapter.slug}`}
          className="inline-flex items-center min-h-[44px] px-2 text-gold/70 hover:text-gold active:text-gold/50 transition-colors"
        >
          ← {prevChapter.title}
        </Link>
      ) : (
        <div />
      )}
      {nextChapter ? (
        <Link
          href={`/novels/${novelSlug}/chapters/${nextChapter.slug}`}
          className="inline-flex items-center min-h-[44px] px-2 text-gold/70 hover:text-gold active:text-gold/50 transition-colors"
        >
          {nextChapter.title} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
