"use client";

interface PageIndicatorProps {
  current: number;
  total: number;
}

export default function PageIndicator({ current, total }: PageIndicatorProps) {
  const progress = (current / total) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-[40rem] mx-auto">
        <div className="h-[2px] bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gold/40 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="text-mist text-xs">
        {current} / {total}
      </span>
    </div>
  );
}
