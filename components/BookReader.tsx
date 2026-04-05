"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { PageData, ChapterMeta } from "@/lib/types";
import PageContent from "./PageContent";
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
}: BookReaderProps) {
  const { currentPage, setCurrentPage } = useReadingProgress(
    novelSlug,
    chapterSlug,
    pages.length
  );
  const [direction, setDirection] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const chromeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-hide header/footer after 3 seconds of inactivity
  const resetChromeTimer = useCallback(() => {
    if (chromeTimerRef.current) clearTimeout(chromeTimerRef.current);
    setChromeVisible(true);
    chromeTimerRef.current = setTimeout(() => {
      setChromeVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetChromeTimer();
    return () => {
      if (chromeTimerRef.current) clearTimeout(chromeTimerRef.current);
    };
  }, [resetChromeTimer]);

  // Reset timer on page change
  useEffect(() => {
    resetChromeTimer();
  }, [currentPage, resetChromeTimer]);

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

  // Center tap toggles chrome, left tap goes back
  const handleContentTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const rect = (
        e.currentTarget as HTMLElement
      ).getBoundingClientRect();
      const clientX =
        "touches" in e ? e.changedTouches[0].clientX : e.clientX;
      const relativeX = (clientX - rect.left) / rect.width;

      if (relativeX < 0.25) {
        // Left 25% → previous page
        goToPrevPage();
      } else if (relativeX > 0.75) {
        // Right 25% → next page (desktop fallback)
        goToNextPage();
      } else {
        // Center 50% → toggle chrome on mobile, next page as secondary
        if (window.innerWidth < 768) {
          if (chromeVisible) {
            setChromeVisible(false);
          } else {
            resetChromeTimer();
          }
        } else {
          goToNextPage();
        }
      }
    },
    [chromeVisible, goToNextPage, goToPrevPage, resetChromeTimer]
  );

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
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Header — auto-hide */}
      <motion.header
        initial={false}
        animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 text-mist text-sm pointer-events-auto"
        style={{ pointerEvents: chromeVisible ? "auto" : "none" }}
      >
        <Link
          href={`/novels/${novelSlug}`}
          className="inline-flex items-center min-h-[44px] px-2 hover:text-gold active:text-gold/70 transition-colors"
        >
          ← 目次
        </Link>
        <span className="text-xs opacity-70 truncate max-w-[50%] text-center">
          {chapterTitle}
        </span>
        <div className="w-14" />
      </motion.header>

      {/* Page Content Area — tap zones built in */}
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

      {/* Footer — auto-hide */}
      <motion.footer
        initial={false}
        animate={{ opacity: chromeVisible ? 1 : 0, y: chromeVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 px-4 py-2"
        style={{ pointerEvents: chromeVisible ? "auto" : "none" }}
      >
        <PageIndicator current={currentPage + 1} total={pages.length} />
        {(isFirstPage || isLastPage) && (
          <ChapterNavigation
            novelSlug={novelSlug}
            prevChapter={isFirstPage ? prevChapter : null}
            nextChapter={isLastPage ? nextChapter : null}
          />
        )}
      </motion.footer>
    </div>
  );
}
