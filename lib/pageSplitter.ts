import type { PageData } from "./types";

const MAX_CHARS_PER_PAGE = 500;
const PAGE_BREAK_MARKER = "<!-- page-break -->";
const ILLUSTRATION_REGEX =
  /<!--\s*illustration:\s*(.+?)\s*-->\s*(?:<!--\s*caption:\s*(.+?)\s*-->)?/g;

export function splitIntoPages(html: string): PageData[] {
  // Pre-process: convert illustration comments to HTML divs
  const processed = html.replace(
    ILLUSTRATION_REGEX,
    (_match, src: string, caption?: string) => {
      const captionHtml = caption
        ? `<div class="caption">${caption.trim()}</div>`
        : "";
      return `<div class="full-illustration"><img src="${src.trim()}" alt="${caption?.trim() || "挿絵"}" />${captionHtml}</div>`;
    }
  );

  // Phase 1: Split on explicit page-break markers
  const segments = processed
    .split(PAGE_BREAK_MARKER)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const pages: PageData[] = [];

  for (const segment of segments) {
    // Check if this segment is/contains a full-page illustration
    if (
      segment.includes('class="full-illustration"') &&
      !segment.includes("<p>")
    ) {
      pages.push({
        html: segment,
        hasIllustration: true,
        isFullPageIllustration: true,
      });
      continue;
    }

    // Phase 2: Auto-split long segments at paragraph boundaries
    const paragraphs = splitIntoParagraphs(segment);
    let currentPageHtml = "";
    let currentCharCount = 0;
    let currentHasIllustration = false;

    for (const para of paragraphs) {
      const isFullIllustration = para.includes('class="full-illustration"');
      const paraTextLength = stripHtml(para).length;

      // Full illustration always gets its own page
      if (isFullIllustration) {
        // Flush current page first
        if (currentPageHtml.trim()) {
          pages.push({
            html: currentPageHtml.trim(),
            hasIllustration: currentHasIllustration,
            isFullPageIllustration: false,
          });
          currentPageHtml = "";
          currentCharCount = 0;
          currentHasIllustration = false;
        }
        pages.push({
          html: para,
          hasIllustration: true,
          isFullPageIllustration: true,
        });
        continue;
      }

      // If adding this paragraph would exceed the limit, start a new page
      if (
        currentCharCount > 0 &&
        currentCharCount + paraTextLength > MAX_CHARS_PER_PAGE
      ) {
        pages.push({
          html: currentPageHtml.trim(),
          hasIllustration: currentHasIllustration,
          isFullPageIllustration: false,
        });
        currentPageHtml = "";
        currentCharCount = 0;
        currentHasIllustration = false;
      }

      currentPageHtml += para + "\n";
      currentCharCount += paraTextLength;
      if (para.includes("<img")) {
        currentHasIllustration = true;
      }
    }

    // Flush remaining content
    if (currentPageHtml.trim()) {
      pages.push({
        html: currentPageHtml.trim(),
        hasIllustration: currentHasIllustration,
        isFullPageIllustration: false,
      });
    }
  }

  return pages.length > 0
    ? pages
    : [{ html: "<p></p>", hasIllustration: false, isFullPageIllustration: false }];
}

function splitIntoParagraphs(html: string): string[] {
  // Split on block-level elements while preserving them
  const blocks: string[] = [];
  // Match <p>...</p>, <blockquote>...</blockquote>, <div ...>...</div>, <h1-6>...</h6>
  const blockRegex =
    /(<(?:p|blockquote|div|h[1-6])[^>]*>[\s\S]*?<\/(?:p|blockquote|div|h[1-6])>)/gi;
  const parts = html.split(blockRegex);

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.length > 0) {
      blocks.push(trimmed);
    }
  }

  return blocks;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, "");
}
