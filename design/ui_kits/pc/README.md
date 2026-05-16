# Wan-Snap Desktop UI Kit

1440 × 900 のデスクトップ UI。3カラム構成（220px サイドバー + 流体コンテンツ + 300px 右レール）。

## ハイライト
- **6画面**（Cover / フィード / さがす / 検索結果 / 詳細モーダル / 愛犬プロフィール）
- すべて Chrome ブラウザフレームでカンバスに並ぶ

## 開く
`index.html` をブラウザで開く。ルートの `pc-shell.jsx`, `pc-screen-feed.jsx`, `pc-screen-detail.jsx` および共通 `tokens.jsx`, `shared.jsx` を相対参照。

## 主要コンポーネント（すべて `pc-shell.jsx`）
- `<PCLayout active rightRail>` — メインレイアウト
- `<PCSidebar>` — 左ナビ（ロゴ + ナビアイテム + 愛犬カード + CTA + プロフィールチップ）
- `<PCHeader>` — ページヘッダー（eyebrow + serif title + cmd+K 検索 + actions）
- `<PCRightRail>` + `<RailSection>` — 右レール
- `<DogRow>` — サイドバー内の愛犬行
- `<PCTab>` — ページ内タブ

## レイアウト
- サイドバー: 220px (固定)
- 右レール: 300px (オプション)
- コンテンツ余白: 40px gutter / 14px gap
- カードラジアス: 14px / 18px (ヒーロー)
- モーダル: ダーク overlay + radius 18 + heavy shadow
