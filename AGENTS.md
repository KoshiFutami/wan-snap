# Wan Snap — プロジェクト仕様書

## サービス概要

犬の服・首輪などのコーデスナップを共有するコミュニティサービス。
同じ犬種・体格のオーナーが実際の着用感を参考にできる「犬種別ファッション図鑑」。

## リポジトリ構成

```
wan-snap/
├── apps/
│   ├── api/          # Nest.js REST API（ポート 3001）
│   │   ├── prisma/   # Prismaスキーマ・マイグレーション
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── posts/   # DDD（中核ドメイン）
│   │       │   ├── dogs/    # DDD（中核ドメイン）
│   │       │   ├── auth/    # シンプルCRUD
│   │       │   ├── users/   # シンプルCRUD
│   │       │   └── likes/   # シンプルCRUD
│   │       ├── infrastructure/
│   │       │   └── database/ # PrismaService
│   │       └── common/       # デコレータ・フィルタ・ガード
│   └── web/          # Next.js フロントエンド（ポート 3000）
│       └── src/
│           ├── app/          # App Router
│           ├── components/   # UIコンポーネント
│           └── lib/          # APIクライアント・ユーティリティ
├── packages/
│   └── shared/       # フロント・バック共通の型定義
├── .claude/          # Claude Code ハーネス設定
├── .github/          # CI/CD ワークフロー・PRテンプレート
├── docker-compose.yml
└── Makefile
```

## DDD モジュール構造（posts / dogs）

```
<module>/
├── domain/
│   ├── entities/        # エンティティ（フレームワーク非依存）
│   ├── value-objects/   # 値オブジェクト
│   ├── repositories/    # リポジトリインターフェース（抽象）
│   └── services/        # ドメインサービス
├── application/
│   └── use-cases/       # ユースケース（1ファイル1ユースケース）
├── infrastructure/
│   ├── repositories/    # Prisma実装
│   └── mappers/         # DB行 ↔ ドメインエンティティ変換
└── presentation/
    └── <module>.controller.ts
```

## ドキュメント管理

### ADR（Architecture Decision Records）

重要な設計判断は `docs/adr/` に記録する。

**書くべきもの:**
- アーキテクチャパターンの採用・変更
- 技術選定（ORM、認証方式など）
- トレードオフを伴う設計判断（集約境界、ページネーション方式など）
- 将来変えにくい決定

**書かなくていいもの:** 細かい実装判断（関数名、ファイル分割など）

```bash
# 新しい ADR を追加するとき
cp docs/adr/0000-template.md docs/adr/NNNN-your-title.md
# docs/adr/README.md の一覧にも追記する
```

### ドメイン設計ドキュメント

DDDモジュールの集約境界・ドメインルール・リポジトリ契約は `docs/design/` に記録する。

- [posts-domain.md](docs/design/posts-domain.md) — Posts ドメイン設計

## よく使うコマンド

```bash
# 環境
make up           # 全サービス起動
make down         # 全サービス停止
make logs         # 全ログ表示
make logs-api     # APIログのみ
make logs-web     # Webログのみ

# DB
make migrate      # マイグレーション実行
make migrate-dev  # 開発用マイグレーション（スキーマ変更時）
make db-reset     # DBリセット＋再マイグレーション
make db-studio    # Prisma Studio 起動

# コード品質
make lint         # ESLint（全ワークスペース）
make lint-fix     # ESLint 自動修正
make typecheck    # TypeScript 型チェック（全ワークスペース）
make test         # テスト実行（全ワークスペース）

# Git
make commit       # /commit カスタムコマンドを呼び出す
make push         # /push カスタムコマンドを呼び出す
make pr           # /pr カスタムコマンドを呼び出す
make review       # /review カスタムコマンドを呼び出す
```

## ブランチ運用

```
main
└── feature/<topic>   # 機能開発（例: feature/post-create）
└── fix/<topic>       # バグ修正（例: fix/post-image-url）
└── chore/<topic>     # 設定・依存更新（例: chore/update-deps）
```

- `main` への直接 push 禁止
- PR 経由でマージ

## API 設計規約

- ベースパス: `/api/v1/`
- 認証: JWT Bearer トークン（`Authorization: Bearer <token>`）
- レスポンス形式: JSON
- エラー形式:
  ```json
  { "statusCode": 400, "message": "...", "error": "Bad Request" }
  ```

### エンドポイント一覧（予定）

| メソッド | パス | 説明 |
|--------|------|------|
| POST | /api/v1/auth/sign-up | 新規登録 |
| POST | /api/v1/auth/sign-in | ログイン |
| POST | /api/v1/auth/refresh | トークンリフレッシュ |
| GET | /api/v1/users/:id | ユーザー取得 |
| PATCH | /api/v1/users/me | 自分のプロフィール更新 |
| GET | /api/v1/dogs | 自分の犬一覧 |
| POST | /api/v1/dogs | 犬プロフィール作成 |
| PATCH | /api/v1/dogs/:id | 犬プロフィール更新 |
| GET | /api/v1/posts | スナップ一覧（フィルタ・カーソルページネーション） |
| POST | /api/v1/posts | スナップ投稿 |
| GET | /api/v1/posts/:id | スナップ詳細 |
| DELETE | /api/v1/posts/:id | スナップ削除 |
| POST | /api/v1/posts/:id/like | いいね |
| DELETE | /api/v1/posts/:id/like | いいね取消 |

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| バックエンド | Nest.js 11, TypeScript |
| ORM | Prisma |
| DB | MySQL 8.4 |
| 認証 | JWT (access 15min / refresh 7d) |
| ストレージ | AWS S3 互換 |
| ローカル環境 | Docker Compose |

## 環境変数

`.env.example` を参照。`.env` は絶対にコミットしない。

## 保護されたファイル

以下のファイルは Claude が自動変更してはならない（hook でブロック済み）:

- `.claude/settings.json`
- `.claude/hooks/pre-protect-config.sh`
- `.claude/hooks/post-lint.sh`
