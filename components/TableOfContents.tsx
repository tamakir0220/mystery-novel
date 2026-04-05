import Link from "next/link";
import type { ChapterMeta } from "@/lib/types";

interface TableOfContentsProps {
  novelSlug: string;
  chapters: ChapterMeta[];
}

export default function TableOfContents({
  novelSlug,
  chapters,
}: TableOfContentsProps) {
  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h2 className="text-lg text-parchment mb-6 text-center">目次</h2>
      <ul className="space-y-1">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/novels/${novelSlug}/chapters/${chapter.slug}`}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-dark-surface/50 transition-colors group"
            >
              <span className="text-mist text-sm w-8 text-right flex-shrink-0">
                {chapter.chapterNumber === 0
                  ? "序"
                  : String(chapter.chapterNumber).padStart(2, "0")}
              </span>
              <span className="text-ghost group-hover:text-parchment transition-colors">
                {chapter.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
