# Wan-Snap Mobile UI Kit

390 × 844 (iPhone 14 Pro) のモバイル UI。すべて React + Babel + 共有トークン。

## ハイライト
- **17画面** + クリックで遷移する動くプロトタイプ
- 左サイドパネルで全画面を瞬時にジャンプ可
- 戻る / リセット / 履歴スタック対応

## 開く
`index.html` をブラウザで開く。すべて相対パスでルートの `tokens.jsx`, `shared.jsx`, `nav.jsx` および `screen-*.jsx` を参照。

## 画面一覧
- **コア** ホーム / 発見 / 検索結果 / 絞り込み / 詳細 / 通知
- **プロフィール** マイわん / 他ユーザー / 愛犬プロフィール / アルバム / 編集系
- **投稿** 新規投稿（タグ付け） / 投稿編集
- **認証** サインイン / サインアップ / 愛犬登録

## 主要コンポーネント（すべて `shared.jsx`）
- `<Screen>`, `<StatusBar>`, `<HomeBar>`, `<TabBar>`, `<AppBar>`
- `<IconBtn>`, `<Chip>`, `<MetaChip>`, `<DogAvatar>`, `<ItemTag>`
- `<TextField>`, `<SelectField>`, `<PrimaryButton>`, `<ListRow>`
- `<Logo>` + `Icons` セット（16種）

## ナビゲーション
`nav.jsx` の `<NavProvider>` + `useNav()` フック。`go(id)` / `back()` / `replace(id)` / `reset(id)`。
コンテキストの外でも安全な no-op で動く。
