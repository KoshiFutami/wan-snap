'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Post } from '../lib/api';

type Props = { post: Post };

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'たった今';
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export function PostCard({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fitItem = post.items.find((i) => i.fitNote);
  const dogName = post.dog?.name ?? 'わんこ';
  const authorName = post.author?.displayName ?? '';
  const breed = post.dog?.breed;
  const weight = post.dog?.weightKg;

  const handleLike = () => {
    setLiked((v) => {
      setLikeCount((c) => v ? c - 1 : c + 1);
      return !v;
    });
  };

  return (
    <article className="border-b border-border-warm bg-white">
      {/* ヘッダー */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
          style={{ background: 'linear-gradient(135deg, #FFE0D0, #FFD6E0)', border: '2px solid #FFE0D0' }}
        >
          🐾
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-extrabold text-text-main leading-tight">
            {dogName}{authorName ? ` & ${authorName}` : ''}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {breed && (
              <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary-dark">
                🐕 {breed}
              </span>
            )}
            {weight != null && (
              <span className="rounded-full bg-accent-yellow-light px-2 py-0.5 text-[10px] font-bold" style={{ color: '#9B7A00' }}>
                ⚖️ {weight}kg
              </span>
            )}
            <span className="text-[10px] text-text-muted">{relativeTime(post.createdAt)}</span>
          </div>
        </div>
        <button className="p-1 text-base text-text-muted">•••</button>
      </div>

      {/* 写真 */}
      <Link href={`/posts/${post.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-surface">
          <Image
            src={post.imageUrl}
            alt={post.caption ?? `${dogName}のスナップ`}
            fill
            sizes="(max-width: 384px) 100vw, 384px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* アクションバー */}
      <div className="flex items-center px-1.5 pt-1 pb-0.5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${liked ? 'text-accent-pink' : 'text-text-sub'}`}
        >
          <span className="text-[20px] leading-none">{liked ? '❤️' : '🤍'}</span>
          {likeCount > 0 && <span className="text-[12px]">{likeCount}</span>}
        </button>
        <Link
          href={`/posts/${post.id}`}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-text-sub transition-colors"
        >
          <span className="text-[20px] leading-none">💬</span>
        </Link>
        <button className="flex items-center rounded-lg px-2.5 py-1.5 text-text-sub transition-colors">
          <span className="text-[20px] leading-none">↗️</span>
        </button>
        <button className="ml-auto flex items-center rounded-lg px-2.5 py-1.5 text-text-sub transition-colors">
          <span className="text-[20px] leading-none">🔖</span>
        </button>
      </div>

      {/* Fit Check ストリップ */}
      {fitItem && (
        <div className="mx-3.5 mb-2 flex items-start gap-2.5 rounded-2xl bg-surface px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-0.5">Fit Check</p>
            <p className="text-xs text-text-sub leading-relaxed">
              {fitItem.size && <><span className="font-bold text-text-main">{fitItem.size}</span>{' — '}</>}
              {fitItem.fitNote}
            </p>
          </div>
        </div>
      )}

      {/* キャプション */}
      {post.caption && (
        <p className="px-3.5 pb-1.5 text-[13px] leading-relaxed text-text-main">
          <span className="font-extrabold">{dogName}</span>{' '}
          {post.caption}
        </p>
      )}

      {/* タグ */}
      {post.tags.length > 0 && (
        <p className="px-3.5 pb-2 text-[13px]">
          {post.tags.map((tag) => (
            <span key={tag} className="mr-1 font-semibold text-accent-blue">#{tag}</span>
          ))}
        </p>
      )}

      {/* アイテムリンク */}
      {post.items.length > 0 && !fitItem && (
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1 px-3.5 pb-3 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
          🏷️ アイテム {post.items.length}件を見る →
        </Link>
      )}

      {(!post.caption && post.tags.length === 0 && post.items.length === 0 && !fitItem) && <div className="pb-3" />}
    </article>
  );
}
