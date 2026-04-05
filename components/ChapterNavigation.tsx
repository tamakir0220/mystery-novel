"use client";

import Link from "next/link";
import type { ChapterMeta } from "@/lib/types";

interface ChapterNavigationProps {
  novelSlug: string;
  prevChapter: ChapterMeta | null;
  nextChapter: ChapterMeta | null;
  showBackToNovel?: boolean;
}

export default function ChapterNavigation({
  novelSlug,
  prevChapter,
  nextChapter,
  showBackToNovel = false,
}: ChapterNavigationProps) {
  return (
    <div className="flex justify-between items-center max-w-[40rem] mx-auto mt-2 text-sm">
      {prevChapter ? (
        <Link
          href={`/novels/${novelSlug}/chapters/${prevChapter.slug}?from=end`}
          className="inline-flex items-center min-h-[44px] px-2 text-gold/70 hover:text-gold active:text-gold/50 transition-colors truncate max-w-[45%]"
        >
          ← {prevChapter.title}
        </Link>
      ) : (
        <div />
      )}
      {showBackToNovel ? (
        <Link
          href={`/novels/${novelSlug}`}
          className="inline-flex items-center min-h-[44px] px-3 py-1 bg-gold/10 border border-gold/30 text-gold rounded-lg hover:bg-gold/20 active:bg-gold/30 transition-colors"
        >
          作品トップへ
        </Link>
      ) : nextChapter ? (
        <Link
          href={`/novels/${novelSlug}/chapters/${nextChapter.slug}`}
          className="inline-flex items-center min-h-[44px] px-2 text-gold/70 hover:text-gold active:text-gold/50 transition-colors truncate max-w-[45%]"
        >
          {nextChapter.title} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
