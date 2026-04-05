"use client";

interface PageTurnControlsProps {
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function PageTurnControls({
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: PageTurnControlsProps) {
  return (
    <>
      {/* Previous page zone - left 25% */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-0 top-0 w-1/4 h-full z-10 cursor-w-resize group"
          aria-label="前のページ"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-mist"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>
      )}

      {/* Next page zone - right 25% */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-0 top-0 w-1/4 h-full z-10 cursor-e-resize group"
          aria-label="次のページ"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-mist"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      )}
    </>
  );
}
