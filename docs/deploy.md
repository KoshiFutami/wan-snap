# デプロイ手順

## 構成

| サービス | ホスティング | 用途 |
|---|---|---|
| `apps/api` (NestJS) | Railway | バックエンド API + MySQL |
| `apps/web` (Next.js) | Vercel | フロントエンド |

PR ごとにプレビュー環境が自動生成される。

---

## Railway セットアップ（初回のみ）

### 1. Railway プロジェクト作成

1. [railway.app](https://railway.app) でプロジェクトを作成
2. GitHub リポジトリを連携し `wan-snap` を選択
3. **Settings → Build** で以下を確認
   - Dockerfile Path: `apps/api/Dockerfile`
   - Docker Build Context: `.`（リポジトリルート）
4. **Settings → Deploy** で PR Environments を有効化（Ephemeral Environments）

### 2. MySQL サービス追加

Railway ダッシュボードで **Add Service → Database → MySQL** を追加。
`DATABASE_URL` が自動で API サービスに共有される。

### 3. 環境変数（API サービス）

| 変数名 | 値 |
|---|---|
| `DATABASE_URL` | Railway MySQL が自動設定 |
| `JWT_SECRET` | ランダム文字列（32文字以上） |
| `JWT_REFRESH_SECRET` | ランダム文字列（JWT_SECRET と別のもの） |
| `NODE_ENV` | `production` |
| `PORT` | `3001`（Railway が自動設定する場合は不要） |

---

## Vercel セットアップ（初回のみ）

### 1. プロジェクト作成

1. [vercel.com](https://vercel.com) で **Add New Project**
2. GitHub リポジトリを選択
3. **Root Directory** を `apps/web` に設定
4. Framework: **Next.js**（自動検出）

### 2. 本番環境変数

| 変数名 | 値 |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<railway-production-domain>/api/v1` |

### 3. プロジェクト ID 取得

```bash
cd apps/web
npx vercel link   # ログインしてプロジェクトを紐付け
cat .vercel/project.json  # projectId と orgId を確認
```

---

## GitHub Secrets 設定

リポジトリの **Settings → Secrets → Actions** で以下を登録。

| Secret 名 | 取得元 |
|---|---|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` の `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` の `projectId` |

---

## ワークフロー概要

### CI (`ci.yml`)

- トリガー: PR 作成・更新、main へのプッシュ
- API と Web それぞれで lint + typecheck を実行

### PR プレビュー (`preview-deploy.yml`)

1. Railway が PR ブランチを自動デプロイ → GitHub `deployment_status` を発行
2. このワークフローがトリガーされ、Railway の PR URL に向けて Next.js を Vercel へデプロイ
3. PR コメントにフロントエンド・バックエンド両方の URL を貼り付け

### PR クローズ (`preview-cleanup.yml`)

- Railway は PR 環境を自動削除
- PR コメントを「削除済み」に更新
