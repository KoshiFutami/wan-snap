import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '../lib/api';

type Props = { post: Post };

export function PostCard({ post }: Props) {
  return (
    <Link href={`/posts/${post.id}`} className="group block overflow-hidden rounded-2xl bg-gray-50">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.caption ?? 'スナップ写真'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {(post.caption || post.tags.length > 0 || post.items.length > 0) && (
        <div className="p-3 space-y-1.5">
          {post.caption && (
            <p className="text-sm text-gray-700 line-clamp-2 leading-snug">{post.caption}</p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {post.items.length > 0 && (
            <p className="text-xs text-gray-400">
              アイテム {post.items.length}件
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
