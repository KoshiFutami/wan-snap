import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../lib/api';

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await api.posts.get(id).catch(() => null);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-text-sub hover:text-primary transition-colors"
      >
        ← 一覧に戻る
      </Link>

      <div className="overflow-hidden rounded-3xl bg-white" style={{ boxShadow: '0 6px 24px rgba(255,107,53,0.12)' }}>
        <div className="relative aspect-square w-full overflow-hidden bg-surface">
          <Image
            src={post.imageUrl}
            alt={post.caption ?? 'スナップ写真'}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 space-y-5">
          {post.caption && (
            <p className="text-text-main leading-relaxed font-medium">{post.caption}</p>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-light px-3 py-1 text-sm font-bold text-primary-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.items.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-text-sub uppercase tracking-widest">🏷️ 着用アイテム</h2>
              <div className="divide-y divide-border-warm">
                {post.items.map((item) => (
                  <div key={item.id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-xs font-bold text-primary-dark"
                          style={{ background: '#FFE0D0' }}
                        >
                          {item.category}
                        </span>
                        {item.brand && (
                          <p className="text-sm font-bold text-text-main">{item.brand}</p>
                        )}
                        {item.productName && (
                          <p className="text-sm text-text-sub">{item.productName}</p>
                        )}
                      </div>
                      {item.size && (
                        <span className="shrink-0 rounded-full border-2 border-border-warm px-3 py-0.5 text-xs font-bold text-text-sub">
                          {item.size}
                        </span>
                      )}
                    </div>
                    {item.fitNote && (
                      <p className="text-xs text-text-sub rounded-2xl px-4 py-2.5 font-medium"
                        style={{ background: '#FFF9F5', border: '1px solid #FFE0D0' }}>
                        💬 {item.fitNote}
                      </p>
                    )}
                    {item.priceJpy != null && (
                      <p className="text-sm font-bold text-text-sub">
                        ¥{item.priceJpy.toLocaleString('ja-JP')}
                      </p>
                    )}
                    {item.purchaseUrl && (
                      <a
                        href={item.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                      >
                        購入ページを見る →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-text-muted">
            {new Date(post.createdAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
