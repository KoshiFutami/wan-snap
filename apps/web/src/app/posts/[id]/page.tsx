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
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        ← 一覧に戻る
      </Link>

      <div className="overflow-hidden rounded-2xl bg-gray-50">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
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
            <p className="text-gray-800 leading-relaxed">{post.caption}</p>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.items.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">着用アイテム</h2>
              <div className="divide-y divide-gray-100">
                {post.items.map((item) => (
                  <div key={item.id} className="py-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 mb-1">
                          {item.category}
                        </span>
                        {item.brand && (
                          <p className="text-sm font-medium text-gray-800">{item.brand}</p>
                        )}
                        {item.productName && (
                          <p className="text-sm text-gray-600">{item.productName}</p>
                        )}
                      </div>
                      {item.size && (
                        <span className="shrink-0 rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500">
                          {item.size}
                        </span>
                      )}
                    </div>
                    {item.fitNote && (
                      <p className="text-xs text-gray-500 bg-amber-50 rounded-lg px-3 py-2">
                        💬 {item.fitNote}
                      </p>
                    )}
                    {item.priceJpy != null && (
                      <p className="text-xs text-gray-400">
                        ¥{item.priceJpy.toLocaleString('ja-JP')}
                      </p>
                    )}
                    {item.purchaseUrl && (
                      <a
                        href={item.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs text-blue-600 hover:underline"
                      >
                        購入ページを見る →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400">
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
