import { test, expect } from "@playwright/test";

const novels = [
  {
    slug: "beginning-story",
    title: "始まりの物語",
    chapterCount: 12,
    firstChapter: "01-prologue",
  },
  {
    slug: "pendulum-murder",
    title: "脅迫と振り子の殺人",
    chapterCount: 12,
    firstChapter: "01-prologue",
  },
  {
    slug: "sake-brewery-revenge",
    title: "酒蔵の復讐劇",
    chapterCount: 8,
    firstChapter: "01-winter-reunion",
  },
  {
    slug: "park-sniper-incident",
    title: "深森自然公園狙撃事件",
    chapterCount: 14,
    firstChapter: "01-prologue",
  },
  {
    slug: "neo-arcadia-incident",
    title: "ネオアルカディア事件",
    chapterCount: 17,
    firstChapter: "01-prologue",
  },
  {
    slug: "mikado-fall-incident",
    title: "帝町転落事件",
    chapterCount: 7,
    firstChapter: "01-prologue",
  },
  {
    slug: "shrine-gunshot",
    title: "帝神社の銃声",
    chapterCount: 8,
    firstChapter: "01-prologue",
  },
];

test.describe("本棚ページ", () => {
  test("全7作品が本棚に表示される", async ({ page }) => {
    await page.goto("/");
    for (const novel of novels) {
      await expect(page.locator(`text=${novel.title}`).first()).toBeVisible();
    }
  });

  test("著者名が正しく表示される", async ({ page }) => {
    await page.goto("/");
    const authorTexts = page.locator("text=みかん");
    await expect(authorTexts.first()).toBeVisible();
  });
});

test.describe("小説詳細ページ", () => {
  for (const novel of novels) {
    test(`${novel.title} の詳細ページが表示される`, async ({ page }) => {
      await page.goto(`/novels/${novel.slug}`);
      await expect(page.locator(`text=${novel.title}`).first()).toBeVisible();
    });

    test(`${novel.title} の章リストに${novel.chapterCount}章ある`, async ({
      page,
    }) => {
      await page.goto(`/novels/${novel.slug}`);
      // Wait for chapter links to load
      const chapterLinks = page.locator(`a[href*="/novels/${novel.slug}/chapters/"]`);
      await expect(chapterLinks.first()).toBeVisible();
      await expect(chapterLinks).toHaveCount(novel.chapterCount);
    });
  }
});

test.describe("章リーダー", () => {
  for (const novel of novels) {
    test(`${novel.title} の第1章が読める`, async ({ page }) => {
      await page.goto(
        `/novels/${novel.slug}/chapters/${novel.firstChapter}`
      );
      // Verify the reader loaded (page should have text content)
      await expect(page.locator("article, main, .reader, [class*=reader], [class*=chapter]").first()).toBeVisible();
    });
  }
});
