'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '../lib/api';
import { api } from '../lib/api';
import { getValidToken } from '../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
};

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

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? T.terracotta : 'none'}>
      <path
        d="M12 20.5s-7.5-4.7-7.5-10.2c0-2.7 2-4.8 4.5-4.8 1.8 0 2.7 1 3 1.7.3-.7 1.2-1.7 3-1.7 2.5 0 4.5 2.1 4.5 4.8 0 5.5-7.5 10.2-7.5 10.2z"
        stroke={filled ? T.terracotta : T.ink}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v11h-9l-4 3.5V16H4V5z" stroke={T.ink} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M12 3l-4 4M12 3l4 4M5 14v5h14v-5" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? T.ink : 'none'}>
      <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke={T.ink} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={T.terracotta}>
      <ellipse cx="6" cy="9" rx="2" ry="2.6" />
      <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
      <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
      <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
      <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
    </svg>
  );
}

export function PostCard({ post }: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarkCount ?? 0);

  const dogName = post.dog?.name ?? 'わんこ';
  const authorName = post.author?.displayName ?? '';
  const breed = post.dog?.breed;
  const weight = post.dog?.weightKg;
  const dogPhotoUrl = post.dog?.photoUrl;

  const handleLike = async () => {
    const token = await getValidToken();
    if (!token) {
      router.push('/auth/sign-in');
      return;
    }
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : c - 1));
    try {
      if (next) {
        await api.posts.like(post.id, token);
      } else {
        await api.posts.unlike(post.id, token);
      }
    } catch {
      // ロールバック
      setLiked(!next);
      setLikeCount((c) => (next ? c - 1 : c + 1));
    }
  };

  const handleBookmark = async () => {
    const token = await getValidToken();
    if (!token) return;
    const next = !bookmarked;
    setBookmarked(next);
    setBookmarkCount((c) => (next ? c + 1 : c - 1));
    try {
      if (next) {
        await api.posts.bookmark(post.id, token);
      } else {
        await api.posts.unbookmark(post.id, token);
      }
    } catch {
      // ロールバック
      setBookmarked(!next);
      setBookmarkCount((c) => (next ? c - 1 : c + 1));
    }
  };

  return (
    <article
      style={{
        background: T.paper,
        borderRadius: 18,
        overflow: 'hidden',
        border: `1px solid ${T.hairline}`,
        marginBottom: 20,
      }}
    >
      {/* ヘッダー */}
      <div style={{ padding: '12px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* アバター */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: T.ink10,
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {dogPhotoUrl ? (
            <Image
              src={dogPhotoUrl}
              alt={`${dogName}の登録画像`}
              fill
              sizes="36px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill={T.ink50}>
              <ellipse cx="6" cy="9" rx="2" ry="2.6" />
              <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
              <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
              <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
              <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{dogName}</span>
            {authorName && (
              <span style={{ fontSize: 10.5, color: T.ink50 }}>{authorName}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
            {breed && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: T.ink70, fontWeight: 500 }}>
                <PawIcon />
                {breed}
              </span>
            )}
            {breed && weight != null && (
              <span style={{ width: 2, height: 2, borderRadius: 2, background: T.ink30, flexShrink: 0 }} />
            )}
            {weight != null && (
              <span style={{ fontSize: 10.5, color: T.ink70, fontFamily: 'var(--font-mono, monospace)', fontWeight: 500 }}>
                {weight}kg
              </span>
            )}
          </div>
        </div>

        <span style={{ fontSize: 10.5, color: T.ink50, flexShrink: 0 }}>{relativeTime(post.createdAt)}</span>
      </div>

      {/* 写真 */}
      <Link href={`/posts/${post.id}`}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', background: T.ink10, overflow: 'hidden' }}>
          <Image
            src={post.imageUrl}
            alt={post.caption ?? `${dogName}のスナップ`}
            fill
            sizes="(max-width: 390px) 100vw, 390px"
            style={{ objectFit: 'cover' }}
          />
          {post.items.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                padding: '5px 9px',
                borderRadius: 999,
                background: 'rgba(31,26,20,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: 10.5,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h6l6 6-6 6-6-6V2z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="5" cy="5" r="1" fill="#fff" />
              </svg>
              {post.items.length} アイテム
            </div>
          )}
        </div>
      </Link>

      {/* アクションバー */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: post.caption ? 10 : 0 }}>
          <button
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: T.ink,
            }}
          >
            <HeartIcon filled={liked} />
            {likeCount > 0 && (
              <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono, monospace)' }}>{likeCount}</span>
            )}
          </button>

          <Link
            href={`/posts/${post.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.ink, textDecoration: 'none' }}
          >
            <CommentIcon />
          </Link>

          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: T.ink }}>
            <ShareIcon />
          </button>

          <div style={{ flex: 1 }} />

          <button
            onClick={handleBookmark}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: T.ink,
            }}
          >
            <BookmarkIcon filled={bookmarked} />
            {bookmarkCount > 0 && (
              <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono, monospace)' }}>{bookmarkCount}</span>
            )}
          </button>
        </div>

        {/* キャプション */}
        {post.caption && (
          <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 600 }}>{dogName}</span>
            <span style={{ color: T.ink70, marginLeft: 8 }}>{post.caption}</span>
          </div>
        )}

        {/* タグ */}
        {post.tags.length > 0 && (
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{ fontSize: 12, color: T.ink50, fontWeight: 500 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
