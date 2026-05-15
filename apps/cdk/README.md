# Wan Snap CDK

Wan Snap の AWS インフラを管理するための CDK アプリです。

## 前提

- Node.js 20+
- pnpm
- AWS 認証情報（`aws configure` または環境変数）

## セットアップ

```bash
pnpm install --frozen-lockfile
```

## よく使うコマンド

```bash
# テンプレート生成
pnpm --filter cdk run synth

# 差分確認
pnpm --filter cdk run diff

# デプロイ
pnpm --filter cdk run deploy
```

## アカウント/リージョン

アカウント情報は `CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION` を利用します。
必要に応じて AWS CLI の profile と region を設定して実行してください。
