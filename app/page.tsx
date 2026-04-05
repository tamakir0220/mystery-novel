import { getAllNovels } from "@/lib/novels";
import Bookshelf from "@/components/Bookshelf";

export default function HomePage() {
  const novels = getAllNovels();

  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="text-center pt-6 md:pt-16 pb-4 md:pb-12 px-6">
        <h1 className="text-2xl md:text-5xl font-bold text-parchment mb-2 md:mb-3">
          Mystery Bookshelf
        </h1>
        <div className="w-16 md:w-24 h-px bg-gold/40 mx-auto mb-2 md:mb-4" />
        <p className="text-mist text-xs md:text-sm">物語の世界へようこそ</p>
      </header>

      {/* Bookshelf */}
      <Bookshelf novels={novels} />
    </div>
  );
}
