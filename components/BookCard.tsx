"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NovelMeta } from "@/lib/types";

interface BookCardProps {
  novel: NovelMeta;
  compact?: boolean;
}

export default function BookCard({ novel, compact = false }: BookCardProps) {
  return (
    <Link href={`/novels/${novel.slug}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "tween", duration: 0.2 }}
        className="group bg-dark-surface/50 border border-dark-border rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
      >
        {/* Cover */}
        <div className="aspect-[2/3] bg-dark overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={novel.coverImage}
            alt={novel.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className={compact ? "p-3" : "p-4"}>
          <h2
            className={`text-parchment font-bold mb-1 group-hover:text-gold transition-colors ${
              compact ? "text-sm" : "text-lg"
            }`}
          >
            {novel.title}
          </h2>
          <p className={`text-mist mb-2 ${compact ? "text-xs" : "text-sm"}`}>
            {novel.author}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="border border-dark-border rounded px-1.5 py-0.5 text-mist">
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
          {!compact && (
            <p className="text-mist/70 text-xs mt-3 line-clamp-2 leading-relaxed">
              {novel.description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
