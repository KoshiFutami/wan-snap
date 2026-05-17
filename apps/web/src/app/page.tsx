'use client';

import { useEffect, useState, useCallback } from 'react';
import { PostCard } from '../components/post-card';
import { getAccessToken, getValidToken } from '../lib/auth-store';
import { api, type Post } from '../lib/api';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
  cream: '#F4EDE0',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const FILTERS = ['すべて', 'フォロー中'] as const;
type Filter = (typeof FILTERS)[number];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('すべて');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(!!getAccessToken());
  }, []);

  const loadPosts = useCallback(async (filter: Filter) => {
    setLoading(true);
    try {
      if (filter === 'フォロー中') {
        const token = await getValidToken().catch(() => null);
        if (!token) {
          setPosts([]);
          return;
        }
        const res = await api.posts.list({ limit: 20, followingOnly: true }, token).catch(() => ({ posts: [] as Post[], nextCursor: null }));
        setPosts(res.posts);
      } else {
        const res = await api.posts.list({ limit: 20 }).catch(() => ({ posts: [] as Post[], nextCursor: null }));
        setPosts(res.posts);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts(activeFilter);
  }, [activeFilter, loadPosts]);

  const handleFilterClick = (filter: Filter) => {
    setActiveFilter(filter);
  };

  const showEmptyFollowing = activeFilter === 'フォロー中' && !loading && posts.length === 0 && isAuthed;
  const showLoginPrompt = activeFilter === 'フォロー中' && !isAuthed;

  return (
    <div>
      {/* フィルターレール */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '14px 12px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {FILTERS.map((label) => {
          const active = label === activeFilter;
          return (
            <button
              key={label}
              onClick={() => handleFilterClick(label)}
              style={{
                padding: '7px 13px',
                borderRadius: 999,
                border: `1px solid ${active ? T.ink : T.hairlineStrong}`,
                background: active ? T.ink : 'transparent',
                color: active ? '#FAF5EA' : T.ink,
                fontSize: 12.5,
                fontWeight: 500,
                lineHeight: 1.2,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* フィード */}
      {loading ? (
        <div style={{ padding: '40px 12px', textAlign: 'center', color: T.ink50, fontSize: 13 }}>読み込み中…</div>
      ) : showLoginPrompt ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 12px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: T.ink50 }}>ログインするとフォロー中のユーザーの投稿を表示できます</p>
        </div>
      ) : showEmptyFollowing ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 12px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: T.ink50 }}>フォロー中のユーザーの投稿がありません</p>
          <p style={{ marginTop: 4, fontSize: 12, color: T.ink50, opacity: 0.7 }}>気になるオーナーをフォローしてみましょう</p>
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '96px 12px',
            textAlign: 'center',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill={T.ink10}>
            <ellipse cx="6" cy="9" rx="2" ry="2.6" />
            <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
            <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
            <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
            <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
          </svg>
          <p style={{ marginTop: 16, fontSize: 15, fontWeight: 600, color: T.ink50 }}>まだスナップがありません</p>
          <p style={{ marginTop: 4, fontSize: 12, color: T.ink50, opacity: 0.7 }}>最初のスナップを投稿してみましょう</p>
        </div>
      ) : (
        <div style={{ padding: '0 12px 24px' }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
