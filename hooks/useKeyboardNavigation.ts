"use client";

import { useEffect } from "react";

interface UseKeyboardNavigationOptions {
  onNext: () => void;
  onPrevious: () => void;
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          onPrevious();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious]);
}
