"use client";

import { useEffect, useRef, type RefObject } from "react";

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
  const swipedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      tracking = true;
      swipedRef.current = false;
    }

    function onPointerUp(e: PointerEvent) {
      if (!tracking) return;
      tracking = false;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (
        Math.abs(deltaX) > threshold &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        swipedRef.current = true;
        if (deltaX < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
    }

    // Suppress click after a swipe to avoid tap+swipe double action
    function onClickCapture(e: MouseEvent) {
      if (swipedRef.current) {
        e.stopPropagation();
        swipedRef.current = false;
      }
    }

    function onPointerCancel() {
      tracking = false;
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
