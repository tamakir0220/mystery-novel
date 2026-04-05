# リソース仕様リファレンス

## プロジェクト構造

```
content/novels/{slug}/
├── novel.md              # 小説メタデータ（frontmatter only、本文なし）
└── chapters/
    ├── 01-prologue.md    # 章ファイル（order順に連番プレフィックス）
    ├── 02-chapter-1.md
    └── ...

public/images/novels/{slug}/
├── cover.svg             # 表紙画像（SVG、400x600）
└── illustrations/        # 挿絵画像（webp推奨）
```

## 小説メタデータ (`novel.md`)

### frontmatter スキーマ

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| title | string | YES | 小説タイトル（日本語） |
| author | string | YES | 著者名（日本語） |
| slug | string | YES | URL用スラッグ（英語 kebab-case、`[a-z0-9-]+`） |
| description | string | YES | あらすじ（1-2文、60文字以内推奨） |
| coverImage | string | YES | 表紙パス: `/images/novels/{slug}/cover.svg` |
| genre | string | YES | ジャンル名（ミステリー/ホラー/SF/恋愛/ファンタジー/サスペンス/ゴシックミステリー 等） |
| status | `"連載中"` \| `"完結"` | YES | 連載状態（この2値のみ許容） |
| order | number | YES | 本棚表示順（正の整数、既存と重複不可） |

### 完全な例

```yaml
---
title: "深淵の呼び声"
author: "影山 翔太"
slug: "abyss-calling"
description: "海辺の廃墟から聞こえる謎の声。オカルトライターが挑む、最後の取材——"
coverImage: "/images/novels/abyss-calling/cover.svg"
genre: "ホラー"
status: "連載中"
order: 3
---
```

本文は不要。frontmatter のみのファイル。

## 章ファイル (`chapters/XX-slug.md`)

### frontmatter スキーマ

| フィールド | 型 | 必須 | 説明 |
|-----------|------|------|------|
| title | string | YES | 章タイトル（例: `"第一章　消えた手紙"`） |
| chapterNumber | number | YES | 章番号（プロローグ=0、以降1,2,3...） |
| order | number | YES | 表示順（1始まり、連番） |

### ファイル名規則

`{order:2桁ゼロ埋め}-{英語スラッグ}.md`

| order | chapterNumber | ファイル名例 |
|-------|---------------|-------------|
| 1 | 0 | `01-prologue.md` |
| 2 | 1 | `02-chapter-1.md` |
| 3 | 2 | `03-chapter-2.md` |
| 10 | 9 | `10-chapter-9.md` |

### 本文の記法

#### ページ区切り
```markdown
前の場面のテキスト。

<!-- page-break -->

次の場面のテキスト。
```
- 場面転換、劇的な間、視点切り替えに使用
- 自動分割は約400-500文字で実行されるため、短い場面には不要

#### インライン挿絵
```markdown
![暗い廊下の情景](/images/novels/midnight-letter/illustrations/ch01-scene01.webp "暗い廊下に差し込む月明かり")
```

#### フルページ挿絵（1ページを占有する大きな挿絵）
```markdown
<!-- illustration: /images/novels/midnight-letter/illustrations/ch01-letter.webp -->
<!-- caption: 床に落ちていた謎の封筒 -->
```

#### 引用（手紙、メモ、心の声）
```markdown
> 明日の午前零時、屋上で待つ。
> 一人で来い。
```

## 表紙SVG仕様

### 基本テンプレート

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a2e"/>  <!-- 上部: 深い暗色 -->
      <stop offset="100%" style="stop-color:#1a0a1e"/> <!-- 下部: わずかに変化 -->
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>

  <!-- ここにモチーフを配置（y: 100-280 の範囲） -->

  <!-- タイトル（y: 350-420） -->
  <text x="200" y="400" font-family="serif" font-size="32"
        fill="#e8e6e0" text-anchor="middle">タイトル</text>

  <!-- 著者名（タイトルの40px下） -->
  <text x="200" y="440" font-family="serif" font-size="16"
        fill="#8888a0" text-anchor="middle">著者名</text>

  <!-- 区切り線（著者名の20px下） -->
  <line x1="120" y1="460" x2="280" y2="460"
        stroke="#c4a35a" stroke-width="0.5" opacity="0.4"/>
</svg>
```

### デザインルール
- **背景**: `#0a0a1a` 〜 `#1a1020` 系のダークグラデーション
- **テキスト色**: タイトル `#e8e6e0`、著者名 `#8888a0`
- **アクセント**: `#c4a35a`（ゴールド）で線画・区切り線
- **モチーフ**: 作品の象徴をシンプルな線画で（stroke のみ、fill なし推奨）
  - ミステリー → 手紙、鍵、時計
  - ホラー → 月、霧、影
  - ゴシック → 館、窓、蔦
  - SF → 星、回路、幾何学模様
- **opacity**: モチーフは 0.3-0.8 で控えめに

## 型定義（`lib/types.ts` より）

```typescript
export interface NovelMeta {
  title: string;
  author: string;
  slug: string;
  description: string;
  coverImage: string;
  genre: string;
  status: "連載中" | "完結";
  order: number;
}

export interface ChapterMeta {
  title: string;
  chapterNumber: number;
  order: number;
  slug: string; // ファイル名から自動導出
}
```
