import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '../lib/api';

type Props = { post: Post };

export function PostCard({ post }: Props) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block overflow-hidden rounded-2xl bg-white transition-all duration-200"
      style={{ boxShadow: '0 2px 8px rgba(255,107,53,0.10)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(255,107,53,0.18)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(255,107,53,0.10)'; }}
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={post.imageUrl}
          alt={post.caption ?? 'スナップ写真'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-3 space-y-2">
        {post.caption && (
          <p className="text-sm text-text-main line-clamp-2 leading-snug font-medium">{post.caption}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-bold text-primary-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.items.length > 0 && (
          <p className="text-xs text-text-muted">
            🏷️ アイテム {post.items.length}件
          </p>
        )}
      </div>
    </Link>
  );
}
