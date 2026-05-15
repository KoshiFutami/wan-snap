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

## bootstrap（初回のみ）

CDK の deploy 前に、対象アカウント/リージョンで bootstrap が必要です。

```bash
pnpm --filter cdk exec cdk bootstrap
```

`cdk bootstrap` では S3 バケットや ECR リポジトリなどの永続リソースが作成され、少額でも継続課金が発生します。検証終了後は不要な bootstrap リソースを削除してください。

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

## バージョン運用

`aws-cdk`（CLI）と `aws-cdk-lib`（ライブラリ）は公開バージョン体系が異なるため、数値は一致しません。  
このリポジトリでは **メジャーバージョン 2 系を維持し、CLI をライブラリ以上の新しい版で運用する**方針とします。
