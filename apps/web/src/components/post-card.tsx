'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Post } from '../lib/api';

type Props = { post: Post };

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(false);

  const fitNote = post.items.find((i) => i.fitNote)?.fitNote;
  const firstItem = post.items[0];

  return (
    <article className="border-b border-border-warm bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
          style={{ background: 'linear-gradient(135deg, #FFE0D0, #FFD6E0)', border: '2px solid #FFE0D0' }}
        >
          🐾
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-main leading-tight truncate">わんこのスナップ</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {post.tags.slice(0, 1).map((tag) => (
              <span key={tag} className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary-dark">
                🏷️ {tag}
              </span>
            ))}
            <span className="text-[10px] text-text-muted">{relativeTime(post.createdAt)}</span>
          </div>
        </div>
        <button className="text-lg text-text-muted">•••</button>
      </div>

      {/* Photo */}
      <Link href={`/posts/${post.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-surface">
          <Image
            src={post.imageUrl}
            alt={post.caption ?? 'スナップ写真'}
            fill
            sizes="(max-width: 384px) 100vw, 384px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-0.5 px-2 pt-1.5 pb-0.5">
        <button
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors ${liked ? 'text-accent-pink' : 'text-text-sub hover:text-primary'}`}
        >
          <span className="text-[19px]">{liked ? '❤️' : '🤍'}</span>
        </button>
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-text-sub hover:text-primary transition-colors">
          <span className="text-[19px]">💬</span>
        </Link>
        <button className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-text-sub hover:text-primary transition-colors">
          <span className="text-[19px]">↗️</span>
        </button>
        <button className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-text-sub hover:text-primary transition-colors">
          <span className="text-[19px]">🔖</span>
        </button>
      </div>

      {/* Fit note strip */}
      {fitNote && firstItem && (
        <div className="mx-3.5 mb-2 flex items-center gap-2.5 rounded-2xl bg-surface px-3 py-2.5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-primary">Fit Check</p>
            <p className="text-xs text-text-sub">
              {firstItem.size && <span className="font-bold text-text-main">{firstItem.size}</span>}
              {firstItem.size && ' — '}
              {fitNote}
            </p>
          </div>
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <p className="px-3.5 pb-2 text-sm leading-relaxed text-text-main">
          <span className="font-bold">わんこ</span>{' '}
          {post.caption}
          {post.tags.map((tag) => (
            <span key={tag} className="ml-1 text-accent-blue font-semibold">#{tag}</span>
          ))}
        </p>
      )}

      {/* Items count */}
      {post.items.length > 0 && (
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1 px-3.5 pb-3 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
          🏷️ アイテム {post.items.length}件を見る →
        </Link>
      )}

      {!post.caption && !fitNote && post.items.length === 0 && <div className="pb-3" />}
    </article>
  );
}
