"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mystery-novel-progress";

interface ProgressData {
  [key: string]: {
    currentPage: number;
    totalPages: number;
    lastReadAt: string;
    completed: boolean;
  };
}

function getProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable
  }
}

export function useReadingProgress(
  novelSlug: string,
  chapterSlug: string,
  totalPages: number
) {
  const key = `${novelSlug}/${chapterSlug}`;
  const [currentPage, setCurrentPageState] = useState(0);

  // Restore saved page on mount
  useEffect(() => {
    const progress = getProgress();
    const saved = progress[key];
    if (saved && saved.currentPage < totalPages) {
      setCurrentPageState(saved.currentPage);
    }
  }, [key, totalPages]);

  const setCurrentPage = useCallback(
    (page: number) => {
      setCurrentPageState(page);
      const progress = getProgress();
      progress[key] = {
        currentPage: page,
        totalPages,
        lastReadAt: new Date().toISOString(),
        completed: page >= totalPages - 1,
      };
      saveProgress(progress);
    },
    [key, totalPages]
  );

  return { currentPage, setCurrentPage };
}

export function getNovelProgress(novelSlug: string): {
  chaptersRead: number;
  lastChapter: string | null;
} {
  const progress = getProgress();
  let chaptersRead = 0;
  let lastChapter: string | null = null;
  let lastTime = "";

  for (const [k, v] of Object.entries(progress)) {
    if (k.startsWith(`${novelSlug}/`)) {
      if (v.completed) chaptersRead++;
      if (v.lastReadAt > lastTime) {
        lastTime = v.lastReadAt;
        lastChapter = k.split("/")[1];
      }
    }
  }

  return { chaptersRead, lastChapter };
}
