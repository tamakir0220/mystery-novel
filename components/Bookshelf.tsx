import type { NovelMeta } from "@/lib/types";
import BookCard from "./BookCard";

interface BookshelfProps {
  novels: NovelMeta[];
}

export default function Bookshelf({ novels }: BookshelfProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
        {novels.map((novel) => (
          <BookCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </div>
  );
}
