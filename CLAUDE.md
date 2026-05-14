# Wan Snap — Claude Agent ガイド

詳細な仕様・コマンド・設計規約は **AGENTS.md** を参照してください。

## 重要ルール

- linter / hook を絶対にバイパスしない（`--no-verify` / `--no-check` 禁止）
- 大きな変更に着手する前は Plan Mode で設計を確認する
- feature ブランチで作業し、main への直接 push はしない
- コミットメッセージは Conventional Commits 形式（`/commit` コマンド参照）
- 共同コミット表記（Co-Authored-By）は付けない
- 機密ファイル（`.env`）は絶対にコミットしない

## 実装方針

- **posts / dogs モジュール** → DDD（Domain / Application / Infrastructure / Presentation の4層）
- **auth / users / likes モジュール** → シンプルCRUD
- ドメイン層にフレームワーク・DB依存を持ち込まない
- コメントは「なぜ」だけ書く。「何を」はコードが語る

## 開発環境

```bash
make up       # 全サービス起動 (Docker)
make migrate  # DBマイグレーション実行
make logs     # ログ確認
```

詳細は AGENTS.md の「よく使うコマンド」を参照。
