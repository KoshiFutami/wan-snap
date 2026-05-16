'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAccessToken, getValidToken } from '../../lib/auth-store';
import { api, type Post } from '../../lib/api';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

export default function AlbumPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setIsAuthed(true);
    getValidToken().then((t) => {
      if (!t) { setLoading(false); return; }
      return api.users.getMyBookmarks(t, { limit: 60 });
    }).then((res) => {
      if (res) setPosts(res.posts);
    }).catch(() => null).finally(() => setLoading(false));
  }, []);

  if (!isAuthed) {
    return (
      <div style={{ padding: '64px 12px', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
          <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke={T.ink10} strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <p style={{ marginTop: 16, fontFamily: 'var(--font-serif, serif)', fontSize: 20, fontWeight: 500, color: T.ink, letterSpacing: '-0.01em' }}>
          保存
        </p>
        <p style={{ marginTop: 8, fontSize: 13, color: T.ink50, lineHeight: 1.6 }}>
          ブックマークを見るには<br />ログインが必要です。
        </p>
        <button
          onClick={() => router.push('/auth/sign-in')}
          style={{
            marginTop: 16,
            padding: '12px 24px',
            borderRadius: 999,
            background: T.ink,
            color: '#FAF5EA',
            fontSize: 13.5,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ログイン
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '64px 12px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: T.ink50 }}>読み込み中…</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{ padding: '64px 12px', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
          <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke={T.ink10} strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <p style={{ marginTop: 16, fontFamily: 'var(--font-serif, serif)', fontSize: 20, fontWeight: 500, color: T.ink, letterSpacing: '-0.01em' }}>
          保存
        </p>
        <p style={{ marginTop: 8, fontSize: 13, color: T.ink50, lineHeight: 1.6 }}>
          気になったスナップを保存すると<br />ここで一覧できます。
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '16px 12px 12px' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 22,
          fontWeight: 500,
          color: T.ink,
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          保存{' '}
          <span style={{ color: T.ink50, fontFamily: 'var(--font-mono, monospace)', fontSize: 14 }}>
            {posts.length}
          </span>
        </h1>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 4,
        padding: '0 12px 16px',
      }}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            style={{ textDecoration: 'none', display: 'block', minWidth: 0 }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1',
              background: T.ink10,
              overflow: 'hidden',
            }}>
              <Image
                src={post.imageUrl}
                alt={post.caption ?? '投稿画像'}
                fill
                sizes="33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
