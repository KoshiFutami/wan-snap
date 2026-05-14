# Architecture Decision Records

このディレクトリはプロジェクトの重要な設計判断を記録します。

## ADR とは

Architecture Decision Record（ADR）は、設計上の重要な決定を「なぜそうしたか」という文脈ごと残すドキュメントです。コードや AGENTS.md には書けない「判断の理由」を後から追えるようにします。

## いつ ADR を書くか

以下の判断をしたときに書いてください。

- アーキテクチャパターンの採用・変更（例: DDD を使う、CQRS を導入する）
- 技術選定（例: ORM に Prisma を採用する）
- トレードオフを伴う設計判断（例: 集約境界をどこに引くか）
- 将来変えにくい決定（例: ページネーション方式）

細かい実装判断（関数名、ファイル分割など）は書かなくて構いません。

## 書き方

`0000-template.md` をコピーして番号を振ってください。

```bash
cp docs/adr/0000-template.md docs/adr/NNNN-your-title.md
```

## ステータス

| ステータス | 意味 |
|-----------|------|
| Proposed | 提案中（まだ決定していない） |
| Accepted | 採用済み |
| Deprecated | 廃止（理由を記載） |
| Superseded by [NNNN] | 別のADRに置き換えられた |

## 一覧

| 番号 | タイトル | ステータス |
|-----|---------|----------|
| [0001](0001-ddd-for-posts-and-dogs.md) | posts/dogs モジュールに DDD を採用 | Accepted |
| [0002](0002-post-item-in-post-aggregate.md) | PostItem を Post 集約内に含める | Accepted |
| [0003](0003-cursor-pagination.md) | 一覧取得にカーソルページネーションを採用 | Accepted |
| [0004](0004-prisma-v5-over-v7.md) | Prisma v5 を採用（v7 からダウングレード） | Accepted |
