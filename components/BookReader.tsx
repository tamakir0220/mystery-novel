"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { PageData, ChapterMeta } from "@/lib/types";
import PageContent from "./PageContent";
import { useSwipe } from "@/hooks/useSwipe";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useReadingProgress } from "@/hooks/useReadingProgress";

interface BookReaderProps {
  pages: PageData[];
  chapterTitle: string;
  novelSlug: string;
  chapterSlug: string;
  prevChapter: ChapterMeta | null;
  nextChapter: ChapterMeta | null;
  pagesBefore: number;
  totalPages: number;
}

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function BookReader({
  pages,
  chapterTitle,
  novelSlug,
  chapterSlug,
  prevChapter,
  nextChapter,
  pagesBefore,
  totalPages,
}: BookReaderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const startFromEnd = searchParams.get("from") === "end";

  const { currentPage, setCurrentPage } = useReadingProgress(
    novelSlug,
    chapterSlug,
    pages.length,
    startFromEnd
  );
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    } else if (nextChapter) {
      router.push(`/novels/${novelSlug}/chapters/${nextChapter.slug}`);
    } else {
      router.push(`/novels/${novelSlug}`);
    }
  }, [currentPage, pages.length, setCurrentPage, nextChapter, novelSlug, router]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    } else if (prevChapter) {
      router.push(
        `/novels/${novelSlug}/chapters/${prevChapter.slug}?from=end`
      );
    }
  }, [currentPage, setCurrentPage, prevChapter, novelSlug, router]);

  const handleContentTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clientX =
        "touches" in e ? e.changedTouches[0].clientX : e.clientX;
      const relativeX = (clientX - rect.left) / rect.width;

      if (relativeX < 0.25) {
        goToPrevPage();
      } else {
        goToNextPage();
      }
    },
    [goToNextPage, goToPrevPage]
  );

  useSwipe(containerRef, {
    onSwipeLeft: goToNextPage,
    onSwipeRight: goToPrevPage,
  });

  useKeyboardNavigation({
    onNext: goToNextPage,
    onPrevious: goToPrevPage,
  });

  const globalPage = pagesBefore + currentPage + 1;
  const progress = (globalPage / totalPages) * 100;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col bg-gradient-to-b from-midnight to-dark overflow-hidden select-none"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-2">
        <Link
          href={`/novels/${novelSlug}`}
          className="inline-flex items-center min-h-[44px] px-2 text-mist text-sm hover:text-gold active:text-gold/70 transition-colors"
        >
          ← 目次
        </Link>
      </header>

      {/* Page Content */}
      <main
        className="flex-1 relative overflow-hidden cursor-pointer"
        onClick={handleContentTap}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.3, ease: "easeOut" },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-start justify-center overflow-y-auto px-5 py-6"
          >
            <div className="w-full max-w-[40rem]">
              <PageContent page={pages[currentPage]} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 px-4 py-2">
        <div className="max-w-[40rem] mx-auto">
          <div className="h-[2px] bg-dark-border rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-gold/40 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-mist">
            <span className="truncate max-w-[60%]">{chapterTitle}</span>
            <span>
              {globalPage} / {totalPages}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
