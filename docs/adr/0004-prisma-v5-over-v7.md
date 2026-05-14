# 0004. Prisma v5 を採用（v7 からダウングレード）

- **ステータス:** Accepted
- **日付:** 2026-05-14

## 背景

初期セットアップで Prisma v7 を導入していたが、MySQL での動作に問題があった。

Prisma v7 は "client" エンジン（TypeScript/WASM ベース）に移行しており、
`PrismaClient` の初期化に `adapter` または `accelerateUrl` が必須となった。
しかし MySQL 向けの公式ドライバーアダプター（`@prisma/adapter-mysql2` 等）は
v7 時点で npm に存在せず、MySQL との接続が不可能な状態だった。

## 判断

Prisma を v7 から v5（5.22.0）にダウングレードする。

## 理由

- Prisma v5 は MySQL + `url = env("DATABASE_URL")` の従来方式で動作し、安定している
- v7 の MySQL アダプターは未公開で、リリース時期も不明
- 開発を止めるよりも安定版で進め、v7 が MySQL 対応した時点でアップグレードを検討する

**検討した代替案:**

- *v7 + PostgreSQL に変更:* DB の変更はインフラ・Docker 設定も含めた大きな変更になるため却下
- *v7 の `engineType = "library"` (旧 Rust エンジン) を使用:* スキーマバリデーションが WASM で行われ、`url` を datasource に書けないため不可

## 結果

- Prisma v5 の通常の開発体験（`url` in schema.prisma、`prisma migrate dev`）が使える
- v7 へのアップグレードは MySQL アダプターの公開後に別 ADR で判断する
