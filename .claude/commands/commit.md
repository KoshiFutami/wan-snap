# /commit

変更をコミットします。

## 手順

1. `git diff --staged` と `git status` で変更内容を確認する
2. 変更が複数の関心事にまたがる場合は分割してコミットする
3. Conventional Commits 形式でメッセージを作成する
4. `git commit -m "..."` でコミットする（`--no-verify` は使わない）

## コミットメッセージ形式

```
<type>(<scope>): <subject>

<body>（任意）
```

### type
- `feat`: 新機能
- `fix`: バグ修正
- `chore`: ビルド・設定変更
- `refactor`: 動作を変えないリファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメントのみの変更

### scope（任意）
- `api`, `web`, `shared`, `docker`, `db` など

## 注意
- 共同コミット表記（Co-Authored-By）は付けない
- `.env` など機密ファイルは絶対にコミットしない
