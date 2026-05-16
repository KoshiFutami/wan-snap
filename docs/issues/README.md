# デザインファイル由来のISSUE下書き

このディレクトリには、デザインファイル（`design/`）を調査して特定した**未実装機能のISSUE下書き**が格納されています。

以下のファイルを GitHub Issues として登録してください。

## ISSUE 一覧

| ファイル | タイトル | フェーズ目安 | 依存 |
|---------|---------|-------------|------|
| [通知画面を実装する.md](通知画面を実装する.md) | 通知画面を実装する（/notifications） | phase/2 | コメント・フォロー・いいね |
| [他ユーザープロフィール画面を実装する.md](他ユーザープロフィール画面を実装する.md) | 他ユーザープロフィール画面を実装する（/users/[id]） | phase/2 | フォロー |
| [フォロー_フォロワー機能を実装する.md](フォロー_フォロワー機能を実装する.md) | フォロー/フォロワー機能を実装する | phase/2 | — |
| [コメント機能を実装する.md](コメント機能を実装する.md) | コメント機能を実装する | phase/2 | — |
| [ブックマーク（スナップ保存）機能を実装する.md](ブックマーク（スナップ保存）機能を実装する.md) | ブックマーク（スナップ保存）機能を実装する | phase/2 | — |
| [いいね機能のフロントエンドUIを実装する.md](いいね機能のフロントエンドUIを実装する.md) | いいね機能のフロントエンドUIを実装する | phase/mvp | — |

## 調査済み・既存ISSUEとの対照

以下はデザインに存在し、既存 ISSUE で対応済みのため新規 ISSUE 化不要。

| デザイン画面 | 対応済みISSUE |
|-------------|-------------|
| 検索・絞り込み画面（search-modal / search-results） | #8 犬の体格・犬種による絞り込み検索 |
| タグフィード | #38 タグ検索・タグフィード機能 |
| 複数写真カルーセル（詳細画面のページネーションドット） | #37 1投稿に複数枚の写真 |
| PC デザイン全般 | #60 PCのCSSが未実装 |
| 犬詳細ページ（dog-profile） | #66 犬詳細ページをデザイン通りに実装（クローズ済み） |
| Apple/Google ソーシャルログイン | #53（クローズ済み） |

## 調査対象ファイル

- `design/screen-home.jsx` — ホームフィード
- `design/screen-explore.jsx` — 発見・マソンリー
- `design/screen-search.jsx` — 絞り込みモーダル
- `design/screen-misc.jsx` — 通知・検索結果
- `design/screen-detail.jsx` — 投稿詳細
- `design/screen-user.jsx` — マイわん・他ユーザー・プロフィール編集・アルバム
- `design/screen-profile.jsx` — 犬プロフィール
- `design/screen-post.jsx` — 新規投稿・投稿編集
- `design/screen-dog.jsx` — 愛犬登録・愛犬編集
- `design/screen-auth.jsx` — サインイン・サインアップ
- `design/pc-screen-feed.jsx` — PC ホーム・PC 発見
- `design/pc-screen-detail.jsx` — PC 詳細モーダル
