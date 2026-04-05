"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PageData, ChapterMeta } from "@/lib/types";
import PageContent from "./PageContent";
import PageTurnControls from "./PageTurnControls";
import PageIndicator from "./PageIndicator";
import ChapterNavigation from "./ChapterNavigation";
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
}

const variants = {
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
}: BookReaderProps) {
  const { currentPage, setCurrentPage } = useReadingProgress(
    novelSlug,
    chapterSlug,
    pages.length
  );
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pages.length, setCurrentPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, setCurrentPage]);

  useSwipe(containerRef, {
    onSwipeLeft: goToNextPage,
    onSwipeRight: goToPrevPage,
  });

  useKeyboardNavigation({
    onNext: goToNextPage,
    onPrevious: goToPrevPage,
  });

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col bg-gradient-to-b from-midnight to-dark overflow-hidden select-none"
    >
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 text-mist text-sm">
        <a
          href={`/novels/${novelSlug}`}
          className="hover:text-gold transition-colors"
        >
          ← 目次
        </a>
        <span className="text-xs opacity-70 truncate max-w-[60%] text-center">
          {chapterTitle}
        </span>
        <div className="w-12" />
      </header>

      {/* Page Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.3, ease: "easeOut" },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-start justify-center overflow-y-auto px-4 py-6"
          >
            <div className="w-full max-w-[40rem]">
              <PageContent page={pages[currentPage]} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Click Zones */}
        <PageTurnControls
          onNext={goToNextPage}
          onPrev={goToPrevPage}
          hasNext={!isLastPage}
          hasPrev={!isFirstPage}
        />
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 px-4 py-3">
        <PageIndicator current={currentPage + 1} total={pages.length} />
        {(isFirstPage || isLastPage) && (
          <ChapterNavigation
            novelSlug={novelSlug}
            prevChapter={isFirstPage ? prevChapter : null}
            nextChapter={isLastPage ? nextChapter : null}
          />
        )}
      </footer>
    </div>
  );
}
