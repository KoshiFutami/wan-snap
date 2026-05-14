# Posts ドメイン設計ドキュメント

## 概要

Wan Snap のコアドメイン。愛犬のコーデスナップ（投稿）を管理する。
投稿には画像・キャプション・タグに加え、着用アイテムの構造化データを持ち、
「同じ犬種・体格のオーナーがサイズ感を参考にできる」という価値を実現する。

---

## 集約境界

```
Post（集約ルート）
├── PostItem[]  ← Post内で管理（独立した集約にしない）
├── PostId      値オブジェクト
├── ImageUrl    値オブジェクト
├── Caption     値オブジェクト
└── Tag[]       値オブジェクト
```

`PostItem` を `Post` の集約内に含める理由は [ADR-002](../adr/0002-post-item-in-post-aggregate.md) を参照。

---

## エンティティ・値オブジェクト一覧

### Post（集約ルート）

| フィールド | 型 | 制約 |
|-----------|-----|------|
| id | PostId | UUID、生成時に付与 |
| authorId | string | 投稿者のユーザーID |
| dogId | string | 着用した犬のID |
| imageUrl | ImageUrl | https/http URLのみ |
| caption | Caption \| null | 最大1,000文字 |
| tags | Tag[] | 各タグ最大50文字 |
| items | PostItem[] | 着用アイテム一覧 |
| createdAt | Date | |
| updatedAt | Date | |

**ドメインルール:**
- `imageUrl` は必須（投稿には必ず1枚の着用写真が必要）
- `authorId` と `dogId` は不変（作成後に変更不可）
- `tags` はタグ文字列の重複を許容しない

### PostItem（エンティティ）

| フィールド | 型 | 制約 |
|-----------|-----|------|
| id | PostItemId | UUID |
| postId | PostId | 親投稿のID |
| category | string | 服/首輪/ハーネス 等（最大50文字） |
| brand | string \| null | 最大100文字 |
| productName | string \| null | 最大200文字 |
| size | string \| null | 最大20文字（例: S, M, 3XL） |
| purchaseUrl | string \| null | 購入リンク |
| priceJpy | number \| null | 円単位、0以上 |
| fitNote | string \| null | サイズ感メモ（最大500文字） |

**ドメインルール:**
- `category` は必須（アイテム分類なしでは検索に使えない）
- `fitNote` がこのドメインの核心価値。「10kgの柴犬にLサイズがぴったり」などの情報が集まる

---

## 値オブジェクト詳細

| クラス | バリデーション |
|--------|--------------|
| PostId | UUID形式 |
| PostItemId | UUID形式 |
| ImageUrl | https/http URL形式 |
| Caption | 1,000文字以内 |
| Tag | 空文字不可・50文字以内・前後空白を除去 |

---

## リポジトリ契約

```typescript
interface IPostRepository {
  findById(id: PostId): Promise<Post | null>;
  findAll(options: FindAllOptions): Promise<{ posts: Post[]; nextCursor: string | null }>;
  save(post: Post): Promise<void>;
  delete(id: PostId): Promise<void>;
}

interface FindAllOptions {
  limit?: number;         // デフォルト20、最大100
  cursor?: string;        // カーソルページネーション（createdAt + id）
  tags?: string[];        // タグでAND絞り込み（将来対応）
  dogBreed?: string;      // 犬種で絞り込み（将来対応）
}
```

ページネーション方式の選定理由は [ADR-003](../adr/0003-cursor-pagination.md) を参照。

---

## ユースケース一覧

| ユースケース | 認可 | 説明 |
|------------|------|------|
| CreatePost | 認証済みユーザー | スナップ投稿。dogIdの所有者チェックあり |
| GetPost | 全員 | 単一投稿取得 |
| ListPosts | 全員 | 一覧取得（カーソルページネーション） |
| DeletePost | 投稿者本人のみ | 論理削除ではなく物理削除 |

### CreatePost の事前条件チェック

1. `dogId` がリクエストユーザーの所有する犬であること
2. `imageUrl` が有効なURL形式であること

dogId の所有者チェックはアプリケーション層で行う（ドメイン層はユーザーIDを知らない）。

---

## 将来の拡張ポイント

- **タグ絞り込み強化:** 現在はタグ文字列のみだが、将来的にカテゴリ enum に昇格させる余地あり
- **いいね数のキャッシュ:** Like テーブルは別集約。投稿一覧にいいね数を含める場合はリードモデルを検討
- **画像複数枚対応:** 現状は1枚。複数枚にする場合は `ImageUrl[]` に変更し集約を修正
