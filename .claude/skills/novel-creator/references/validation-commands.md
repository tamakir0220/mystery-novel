# バリデーションコマンド集

スキル実行時に使用するバリデーション手順。

## 1. slug 重複チェック

```bash
ls content/novels/
```
出力に新しい slug と同名のディレクトリがないことを確認。

## 2. order 重複チェック

```bash
grep -r "^order:" content/novels/*/novel.md
```
新しい order 値が既存と重複しないことを確認。

## 3. 章の連番チェック

```bash
ls content/novels/{slug}/chapters/
```
ファイル名のプレフィックス（01, 02, 03...）が連続していることを確認。

```bash
grep -r "^order:\|^chapterNumber:" content/novels/{slug}/chapters/*.md
```
order と chapterNumber が整合していることを確認。

## 4. 画像パス整合チェック

novel.md の coverImage パスに対応するファイルが存在すること:
```bash
ls public/images/novels/{slug}/cover.svg
```

章内の挿絵パスに対応するファイルが存在すること:
```bash
grep -r "illustrations/" content/novels/{slug}/chapters/*.md
```
→ 参照されたパスが `public/` 以下に存在するか確認。

## 5. frontmatter 型チェック

- `status` が `"連載中"` または `"完結"` であること（他の値はビルドエラーにはならないが仕様外）
- `order` が正の整数であること
- `slug` が `[a-z0-9-]+` パターンに合致すること
- `coverImage` が `/images/novels/{slug}/cover.svg` の形式であること

## 6. ビルド確認

```bash
npm run build
```

確認ポイント:
- `Generating static pages` で全ページが生成されること
- 新しい小説・章のルートが Route 一覧に表示されること
- エラーや警告がないこと

### ビルド失敗時のよくある原因

| エラーパターン | 原因 | 対処 |
|--------------|------|------|
| `YAML parse error` | frontmatter の構文エラー | クォート忘れ、インデント不正を修正 |
| `File not found` | coverImage パスの typo | パスを修正、ファイル存在確認 |
| `generateStaticParams` エラー | novel.md または chapters/ が不正 | ファイル構造を確認 |
