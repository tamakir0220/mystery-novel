import { notFound } from "next/navigation";
import { getAllNovels, getNovel } from "@/lib/novels";
import { getAllChapters } from "@/lib/chapters";
import TableOfContents from "@/components/TableOfContents";
import Link from "next/link";

export const dynamicParams = false;

export async function generateStaticParams() {
  const novels = getAllNovels();
  return novels.map((novel) => ({ novelSlug: novel.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ novelSlug: string }>;
}) {
  const { novelSlug } = await params;
  const novel = getNovel(novelSlug);
  if (!novel) return {};
  return {
    title: novel.title,
    description: novel.description,
  };
}

export default async function NovelPage({
  params,
}: {
  params: Promise<{ novelSlug: string }>;
}) {
  const { novelSlug } = await params;
  const novel = getNovel(novelSlug);
  if (!novel) notFound();

  const chapters = getAllChapters(novelSlug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight to-dark">
      {/* Back to bookshelf */}
      <nav className="px-6 py-4">
        <Link
          href="/"
          className="text-mist text-sm hover:text-gold transition-colors"
        >
          ← 本棚に戻る
        </Link>
      </nav>

      {/* Novel Hero */}
      <div className="flex flex-col items-center px-6 pt-8 pb-12">
        {/* Cover Image */}
        <div className="w-48 h-72 md:w-56 md:h-84 rounded-lg overflow-hidden shadow-2xl mb-8 bg-dark-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={novel.coverImage}
            alt={novel.title}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-parchment text-center mb-2">
          {novel.title}
        </h1>
        <p className="text-mist text-sm mb-1">{novel.author}</p>
        <div className="flex items-center gap-3 text-xs text-mist/70 mb-6">
          <span className="border border-dark-border rounded px-2 py-0.5">
            {novel.genre}
          </span>
          <span
            className={
              novel.status === "完結" ? "text-gold" : "text-ghost"
            }
          >
            {novel.status}
          </span>
        </div>
        <p className="text-ghost text-center max-w-lg leading-relaxed">
          {novel.description}
        </p>

        {/* Start Reading Button */}
        {chapters.length > 0 && (
          <Link
            href={`/novels/${novelSlug}/chapters/${chapters[0].slug}`}
            className="mt-8 px-8 py-3 bg-gold/10 border border-gold/30 text-gold rounded-lg hover:bg-gold/20 transition-colors"
          >
            読み始める
          </Link>
        )}
      </div>

      {/* Divider */}
      <div className="max-w-lg mx-auto px-6">
        <div className="h-px bg-dark-border" />
      </div>

      {/* Table of Contents */}
      <TableOfContents novelSlug={novelSlug} chapters={chapters} />
    </div>
  );
}
