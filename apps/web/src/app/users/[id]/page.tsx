'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getAccessToken, getValidToken } from '../../../lib/auth-store';
import { api, type Post, type PublicDog, type User } from '../../../lib/api';

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

const USER_PROFILE_POST_LIMIT = 60;

export default function OtherUserProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userIdParam = params.id;
  const userId = typeof userIdParam === 'string' ? userIdParam : '';
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [dogs, setDogs] = useState<PublicDog[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'snaps' | 'size' | 'brands'>('snaps');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!userId) {
      setStatus('not-found');
      return;
    }
    let cancelled = false;

    const load = async () => {
      setStatus('loading');
      const accessToken = getAccessToken();
      const mePromise = accessToken
        ? getValidToken()
          .then((token) => (token ? api.users.getMe(token).catch(() => null) : null))
          .catch(() => null)
        : Promise.resolve(null);

      const [me, targetUser, postResponse, dogsResponse] = await Promise.all([
        mePromise,
        api.users.getById(userId).catch(() => null),
        api.posts.list({ limit: USER_PROFILE_POST_LIMIT, authorId: userId }).catch(() => ({ posts: [] as Post[], nextCursor: null })),
        api.dogs.listByUser(userId).catch(() => [] as PublicDog[]),
      ]);

      if (cancelled) return;

      if (me?.id === userId) {
        router.replace('/profile');
        return;
      }

      if (!targetUser) {
        setStatus('not-found');
        return;
      }

      const authoredPosts = postResponse.posts;
      setUser(targetUser);
      setPosts(authoredPosts);
      setDogs(
        dogsResponse.length > 0
          ? dogsResponse
          : fallbackDogsFromPosts(authoredPosts, targetUser.displayName),
      );
      setStatus('ready');
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [router, userId]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  if (status === 'loading') {
    return <div style={{ padding: '80px 12px', textAlign: 'center', color: T.ink50 }}>読み込み中…</div>;
  }

  if (status === 'not-found' || !user) {
    return <div style={{ padding: '80px 12px', textAlign: 'center', color: T.ink50 }}>ユーザーが見つかりません</div>;
  }

  const postCount = posts.length;

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={{ padding: '8px 12px 6px', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M14 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700, color: T.ink }}>
          @{user.displayName.trim().replace(/\s+/g, '_')}
        </div>
        <div style={{ width: 36, flexShrink: 0 }} />
      </div>

      <div style={{ padding: '8px 12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 38,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
          }}>
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={`${user.displayName}のアイコン`} fill sizes="76px" style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: 34,
                lineHeight: 1,
                color: T.ink,
              }}>
                {user.displayName.slice(0, 1)}
              </span>
            )}
          </div>

          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 8,
          }}>
            <ProfileStat value={formatCount(postCount)} label="投稿" />
            <ProfileStat value="準備中" label="フォロワー" />
            <ProfileStat value="準備中" label="フォロー中" />
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 24, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.01em', marginTop: 14,
        }}>
          {user.displayName}
        </div>

        <div style={{ fontSize: 12, color: T.ink70, lineHeight: 1.65, marginTop: 8 }}>
          {user.bio || 'このユーザーはまだ自己紹介を設定していません。'}
          {user.location ? <div>{user.location}</div> : null}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button
            onClick={handleToggleFollow}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 999,
              background: isFollowing ? T.paper : T.ink,
              color: isFollowing ? T.ink : T.cream,
              border: isFollowing ? `1px solid ${T.hairlineStrong}` : 'none',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {isFollowing ? 'フォロー済み' : 'フォローする'}
          </button>
          <button
            type="button"
            disabled
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 999,
              background: T.paper, color: T.ink,
              border: `1px solid ${T.hairlineStrong}`,
              fontSize: 12.5, fontWeight: 500, cursor: 'not-allowed', fontFamily: 'inherit',
              opacity: 0.6,
            }}
          >
            メッセージ
          </button>
          <button
            type="button"
            aria-label="その他"
            disabled
            style={{
              width: 40, padding: '10px', borderRadius: 999,
              background: T.paper, border: `1px solid ${T.hairlineStrong}`,
              color: T.ink, cursor: 'not-allowed', opacity: 0.6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="3" cy="7" r="1.2" fill="currentColor" />
              <circle cx="7" cy="7" r="1.2" fill="currentColor" />
              <circle cx="11" cy="7" r="1.2" fill="currentColor" />
            </svg>
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: 10.5, color: T.ink50 }}>
          フォロー状態は将来API連携予定です（現在はこの画面内のみ反映）。
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 16, fontWeight: 500, color: T.ink }}>
            {user.displayName}の愛犬
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '0 12px 4px', overflowX: 'auto' }}>
          {dogs.length > 0 ? (
            dogs.map((dog, i) => (
              <Link key={dog.id} href={`/dogs/${dog.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <DogCard dog={dog} active={i === 0} />
              </Link>
            ))
          ) : (
            <div style={{ padding: '0 2px', fontSize: 12, color: T.ink50 }}>登録された愛犬はいません</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          borderBottom: `1px solid ${T.hairline}`,
        }}>
          <ProfileTab
            label="スナップ"
            count={postCount}
            active={activeTab === 'snaps'}
            onClick={() => setActiveTab('snaps')}
          />
          <ProfileTab
            label="サイズ感"
            count={0}
            active={activeTab === 'size'}
            onClick={() => setActiveTab('size')}
          />
          <ProfileTab
            label="ブランド"
            count={0}
            active={activeTab === 'brands'}
            onClick={() => setActiveTab('brands')}
          />
        </div>

        {activeTab === 'snaps' ? (
          posts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 4,
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 12px 16px',
              overflow: 'hidden',
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
          ) : (
            <div style={{ padding: '18px 12px 0', fontSize: 12, color: T.ink50 }}>
              まだ投稿はありません
            </div>
          )
        ) : (
          <div style={{ padding: '18px 12px 0', fontSize: 12, color: T.ink50 }}>
            このタブはフェーズ2で実装予定です。
          </div>
        )}
      </div>
    </div>
  );
}

function formatCount(value: number): string {
  if (value >= 1000) {
    const rounded = Number((value / 1000).toFixed(1));
    return `${rounded}k`;
  }
  return String(value);
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-serif, serif)',
        fontSize: 28,
        lineHeight: 1,
        color: T.ink,
      }}>
        {value}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: T.ink50 }}>{label}</div>
    </div>
  );
}

function ProfileTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '0 0 14px',
        border: 'none',
        background: 'none',
        color: active ? T.ink : T.ink50,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}{' '}
      <span style={{ color: T.ink30, fontWeight: 500 }}>{count}</span>
      {active && (
        <span style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 3,
          borderRadius: 999,
          background: T.ink,
        }} />
      )}
    </button>
  );
}

function DogCard({ dog, active }: { dog: PublicDog; active: boolean }) {
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
        {dog.weightKg != null ? `${dog.breed} · ${dog.weightKg}kg` : dog.breed}
      </div>
    </div>
  );
}

function fallbackDogsFromPosts(posts: Post[], ownerDisplayName: string): PublicDog[] {
  const dogMap = new Map<string, PublicDog>();
  posts.forEach((post) => {
    if (!dogMap.has(post.dogId)) {
      dogMap.set(post.dogId, {
        id: post.dogId,
        name: post.dog?.name ?? 'わんこ',
        breed: post.dog?.breed ?? '不明',
        weightKg: post.dog?.weightKg ?? null,
        photoUrl: post.dog?.photoUrl ?? null,
        ownerDisplayName,
      });
    }
  });
  return Array.from(dogMap.values());
}
