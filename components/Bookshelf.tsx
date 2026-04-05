import type { NovelMeta } from "@/lib/types";
import BookCard from "./BookCard";

interface BookshelfProps {
  novels: NovelMeta[];
}

export default function Bookshelf({ novels }: BookshelfProps) {
  // 4冊以上なら小さめのカード、3冊以下はゆったり表示
  const isCompact = novels.length >= 4;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <div
        className={
          isCompact
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        }
      >
        {novels.map((novel) => (
          <BookCard key={novel.slug} novel={novel} compact={isCompact} />
        ))}
      </div>
    </div>
  );
}
