'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens, getValidToken } from '../../lib/auth-store';
import { api, type User, type Dog } from '../../lib/api';

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
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    setIsAuthed(true);
    getValidToken().then((t) => {
      if (!t) return;
      Promise.all([
        api.users.getMe(t),
        api.dogs.list(t),
      ]).then(([u, d]) => {
        setUser(u);
        setDogs(d);
      }).catch(() => null);
    });
  }, []);

  const handleSignOut = () => {
    clearTokens();
    router.push('/');
  };

  if (!isAuthed) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill={T.ink10} style={{ margin: '0 auto' }}>
          <ellipse cx="6" cy="9" rx="2" ry="2.6" />
          <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
          <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
          <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
          <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
        </svg>
        <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: T.ink70 }}>ログインが必要です</p>
        <button
          onClick={() => router.push('/auth/sign-in')}
          style={{
            marginTop: 16,
            padding: '12px 24px',
            borderRadius: 999,
            background: T.ink,
            color: T.cream,
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

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* トップバー */}
      <div style={{
        padding: '8px 16px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>
          {user?.displayName ?? '…'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/posts/new" style={{
            width: 36, height: 36, borderRadius: 18,
            background: T.cream,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${T.hairline}`,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2v14M3 9l7-7 7 7" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/profile/edit" style={{
            width: 36, height: 36, borderRadius: 18,
            background: T.cream,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${T.hairline}`,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke={T.ink} strokeWidth="1.5" />
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4 4l1.5 1.5M14.5 14.5L16 16M4 16l1.5-1.5M14.5 5.5L16 4"
                stroke={T.ink} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ユーザーヘッダー */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* アバター */}
          <div style={{
            width: 76, height: 76, borderRadius: 38,
            background: T.cream,
            border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="36" height="36" viewBox="0 0 20 20" fill={T.ink50}>
                <circle cx="10" cy="7" r="3.2" />
                <path d="M3.5 17c.8-3.4 3.5-5 6.5-5s5.7 1.6 6.5 5" />
              </svg>
            )}
          </div>
        </div>

        {/* 名前 */}
        <div style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 24, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.01em', marginTop: 14,
        }}>
          {user?.displayName ?? '…'}
        </div>

        {/* bio / location */}
        {(user?.bio || user?.location) && (
          <div style={{ fontSize: 12, color: T.ink70, lineHeight: 1.55, marginTop: 4 }}>
            {user?.location && <span>{user.location} · </span>}
            {user?.bio}
          </div>
        )}

        {/* ボタン行 */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Link href="/profile/edit" style={{
            flex: 1, padding: '9px 14px', borderRadius: 10,
            background: T.paper, color: T.ink,
            border: `1px solid ${T.hairlineStrong}`,
            fontSize: 12, fontWeight: 500,
            textAlign: 'center', textDecoration: 'none',
          }}>
            プロフィール編集
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              padding: '9px 14px', borderRadius: 10,
              background: T.paper, color: T.ink70,
              border: `1px solid ${T.hairlineStrong}`,
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* マイわんセクション */}
      <div style={{ marginTop: 28 }}>
        <div style={{
          padding: '0 20px 12px',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 16, fontWeight: 500, color: T.ink,
          }}>
            マイわん{' '}
            {dogs.length > 0 && (
              <span style={{ color: T.ink50, fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>
                {dogs.length}
              </span>
            )}
          </div>
          <Link href="/dogs/new" style={{
            fontSize: 11, color: T.terracotta, fontWeight: 500,
            textDecoration: 'none',
          }}>
            + 追加
          </Link>
        </div>

        <div style={{
          display: 'flex', gap: 10, padding: '0 20px 4px',
          overflowX: 'auto',
        }}>
          {dogs.map((dog, i) => (
            <DogCard key={dog.id} dog={dog} active={i === 0} />
          ))}
          <DogCardPlaceholder />
        </div>
      </div>

      {/* スナップを投稿 */}
      <div style={{ padding: '24px 20px 0' }}>
        <Link href="/posts/new" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          background: T.paper,
          borderRadius: 14,
          border: `1px solid ${T.hairline}`,
          textDecoration: 'none',
          color: T.ink,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: T.cream,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke={T.ink70} strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" stroke={T.ink70} strokeWidth="1.5" />
              <circle cx="17" cy="8" r="1.2" fill={T.ink70} />
            </svg>
          </div>
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>スナップを投稿</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke={T.ink50} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function DogCard({ dog, active }: { dog: Dog; active: boolean }) {
  return (
    <div style={{
      width: 88, padding: 8, borderRadius: 14,
      background: active ? T.paper : 'transparent',
      border: active ? `1px solid ${T.hairlineStrong}` : `1px solid transparent`,
      flexShrink: 0,
      boxShadow: active ? '0 4px 14px rgba(31,26,20,0.06)' : 'none',
    }}>
      <div style={{
        width: '100%', aspectRatio: '1', borderRadius: 10,
        background: dog.photoUrl
          ? `url(${dog.photoUrl}) center/cover`
          : T.ink10,
        marginBottom: 6,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {!dog.photoUrl && (
          <svg width="28" height="28" viewBox="0 0 24 24" fill={T.ink50}>
            <ellipse cx="6" cy="9" rx="2" ry="2.6" />
            <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
            <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
            <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
            <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
          </svg>
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, textAlign: 'center' }}>
        {dog.name}
      </div>
      <div style={{
        fontSize: 9, color: T.ink50, textAlign: 'center', marginTop: 2,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {dog.breed}{dog.weightKg != null ? ` · ${dog.weightKg}kg` : ''}
      </div>
    </div>
  );
}

function DogCardPlaceholder() {
  return (
    <Link href="/dogs/new" style={{ textDecoration: 'none' }}>
      <div style={{
        width: 88, height: 114, borderRadius: 14,
        border: `1px dashed ${T.hairlineStrong}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4, color: T.ink50, flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 10 }}>追加</span>
      </div>
    </Link>
  );
}
