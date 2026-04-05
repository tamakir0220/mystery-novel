"use client";

import type { PageData } from "@/lib/types";

interface PageContentProps {
  page: PageData;
}

export default function PageContent({ page }: PageContentProps) {
  if (page.isFullPageIllustration) {
    return (
      <div
        className="full-illustration"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    );
  }

  return (
    <div
      className="prose prose-lg max-w-none reading-content"
      dangerouslySetInnerHTML={{ __html: page.html }}
    />
  );
}
