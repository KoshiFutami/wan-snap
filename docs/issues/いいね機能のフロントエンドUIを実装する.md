# いいね機能のフロントエンドUIを実装する

## 概要

バックエンドには既にいいね API（`POST /api/v1/posts/:id/like`、`DELETE /api/v1/posts/:id/like`）が存在するが、フロントエンドのUI（いいねボタン・件数表示・トグル状態）が未実装。
現在、フィードカード・投稿詳細ページにいいねボタンが表示されていない。

## デザイン仕様（複数画面）

- **ホームフィード**（`screen-home.jsx` - FeedCard）:
  - フッターアクション行: **❤️ 428**（件数）/ 💬 34 / 📤 / 🔖 62
  - ハートアイコンはタップで塗りつぶし（いいね済み状態）
- **投稿詳細画面**（`screen-detail.jsx` - DetailScreen）:
  - アクションバー: **❤️ 428**（赤塗り・いいね済み状態）/ 💬 34
- **PC ホーム**（`pc-screen-feed.jsx`）:
  - カードフッター: **❤️ {件数}** / 💬 34 / 📤

## 受け入れ条件

- [ ] フィードカードにいいねボタン（ハートアイコン）と件数を表示する
- [ ] 投稿詳細画面にいいねボタンと件数を表示する
- [ ] いいね済みの場合はハートを塗りつぶし（テラコッタ色）で表示する
- [ ] ボタンタップでいいね/取消のトグル操作ができる（認証済みユーザーのみ）
- [ ] 未認証の場合はサインインページへ誘導する
- [ ] トグル操作後に件数をオプティミスティックに更新する

## 技術メモ

- バックエンド API は既存:
  - `POST /api/v1/posts/:id/like` — いいね
  - `DELETE /api/v1/posts/:id/like` — いいね取消
- `GET /api/v1/posts/:id` のレスポンスに `likesCount` と `isLikedByMe` を追加する必要あり
- フィード一覧（`GET /api/v1/posts`）のレスポンスにも `likesCount` と `isLikedByMe` を追加
- オプティミスティックUI: ボタンタップ時に即時 UI 更新し、エラー時にロールバック

## 関連デザインファイル

- `design/screen-home.jsx` — FeedCard（いいねアイコン + 件数）
- `design/screen-detail.jsx` — DetailScreen（いいねアイコン + 件数）
- `design/pc-screen-feed.jsx` — PCHomeScreen（カードフッター）
- `design/shared.jsx` — `Icons.heart(c, filled)` （塗りつぶし状態あり）
