"use client";

import { useEffect, type RefObject } from "react";

interface UseSwipeOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  options: UseSwipeOptions
) {
  const { onSwipeLeft, onSwipeRight, threshold = 50 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    function onPointerDown(e: PointerEvent) {
      // Only track primary pointer (left mouse / single touch)
      if (e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      tracking = true;
    }

    function onPointerUp(e: PointerEvent) {
      if (!tracking) return;
      tracking = false;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Only trigger if horizontal movement is dominant
      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
    }

    function onPointerCancel() {
      tracking = false;
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
