"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NovelMeta } from "@/lib/types";

interface BookCardProps {
  novel: NovelMeta;
}

export default function BookCard({ novel }: BookCardProps) {
  return (
    <Link href={`/novels/${novel.slug}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "tween", duration: 0.2 }}
        className="group bg-dark-surface/50 border border-dark-border rounded-lg md:rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
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

        {/* Info — compact on mobile */}
        <div className="p-2 md:p-4">
          <h2 className="text-xs md:text-lg text-parchment font-bold mb-0.5 md:mb-1 group-hover:text-gold transition-colors line-clamp-1">
            {novel.title}
          </h2>
          <p className="text-[10px] md:text-sm text-mist mb-1 md:mb-2">
            {novel.author}
          </p>
          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
            <span className="border border-dark-border rounded px-1 md:px-1.5 py-0.5 text-mist">
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
          <p className="hidden md:block text-mist/70 text-xs mt-3 line-clamp-2 leading-relaxed">
            {novel.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
