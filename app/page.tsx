import { getAllNovels } from "@/lib/novels";
import Bookshelf from "@/components/Bookshelf";

export default function HomePage() {
  const novels = getAllNovels();

  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="text-center pt-16 pb-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-parchment mb-3">
          Mystery Bookshelf
        </h1>
        <div className="w-24 h-px bg-gold/40 mx-auto mb-4" />
        <p className="text-mist text-sm">物語の世界へようこそ</p>
      </header>

      {/* Bookshelf */}
      <Bookshelf novels={novels} />
    </div>
  );
}
