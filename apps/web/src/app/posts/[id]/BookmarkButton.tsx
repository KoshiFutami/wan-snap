'use client';

import { useState } from 'react';
import { api, ApiError } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';

const T = {
  ink: '#1F1A14',
  terracotta: '#B95A3D',
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? T.ink : 'none'}>
      <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke={T.ink} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  postId: string;
  initialCount: number;
  initialBookmarked?: boolean;
};

export function BookmarkButton({ postId, initialCount, initialBookmarked = false }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [count, setCount] = useState(initialCount);

  const handleBookmark = async () => {
    const token = await getValidToken();
    if (!token) return;
    const next = !bookmarked;
    setBookmarked(next);
    setCount((c) => (next ? c + 1 : c - 1));
    try {
      if (next) {
        await api.posts.bookmark(postId, token);
      } else {
        await api.posts.unbookmark(postId, token);
      }
    } catch (error) {
      if (next && error instanceof ApiError && error.status === 409) {
        setCount((c) => c - 1);
        return;
      }
      if (!next && error instanceof ApiError && error.status === 404) {
        setCount((c) => c + 1);
        return;
      }
      setBookmarked(!next);
      setCount((c) => (next ? c - 1 : c + 1));
    }
  };

  return (
    <button
      onClick={handleBookmark}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        width: 'auto',
        minWidth: 38,
        height: 38,
        borderRadius: 19,
        padding: '0 10px',
        background: bookmarked ? 'rgba(185,90,61,0.14)' : 'rgba(255,255,255,0.92)',
        border: bookmarked ? `1px solid ${T.terracotta}` : '1px solid rgba(31,26,20,0.12)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        justifyContent: 'center',
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: bookmarked ? T.terracotta : T.ink,
      }}
      aria-label={bookmarked ? 'ブックマーク解除' : 'ブックマーク'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? T.terracotta : 'none'}>
        <path
          d="M6 4h12v17l-6-3.5L6 21V4z"
          stroke={bookmarked ? T.terracotta : T.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && (
        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono, monospace)' }}>
          {count}
        </span>
      )}
    </button>
  );
}
