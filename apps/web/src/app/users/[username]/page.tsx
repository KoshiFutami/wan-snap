'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getAccessToken, getValidToken } from '../../../lib/auth-store';
import { api, type Post, type PublicDog, type User, type UserPublic } from '../../../lib/api';
import { resolveBreedName } from '../../../lib/breed';

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
  const params = useParams<{ username: string }>();
  const usernameParam = params.username;
  const username = typeof usernameParam === 'string' ? usernameParam : '';
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [dogs, setDogs] = useState<PublicDog[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'snaps' | 'size' | 'brands'>('snaps');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [myToken, setMyToken] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followListTab, setFollowListTab] = useState<'followers' | 'following' | null>(null);

  useEffect(() => {
    if (!username) {
      setStatus('not-found');
      return;
    }
    let cancelled = false;

    const load = async () => {
      setStatus('loading');
      const accessToken = getAccessToken();
      const tokenPromise = accessToken ? getValidToken().catch(() => null) : Promise.resolve(null);

      const token = await tokenPromise;
      const meResult = token ? await api.users.getMe(token).catch(() => null) : null;

      if (cancelled) return;

      if (meResult?.username.toLowerCase() === username.toLowerCase()) {
        router.replace('/profile');
        return;
      }

      const targetUser = await api.users.getByUsername(username, token ?? undefined).catch(() => null);

      if (cancelled) return;

      if (!targetUser) {
        setStatus('not-found');
        return;
      }

      const [postResponse, dogsResponse] = await Promise.all([
        api.posts.list({ limit: USER_PROFILE_POST_LIMIT, authorId: targetUser.id }, token ?? undefined).catch(() => ({ posts: [] as Post[], nextCursor: null })),
        api.dogs.listByUser(targetUser.id).catch(() => [] as PublicDog[]),
      ]);

      if (cancelled) return;

      const authoredPosts = postResponse.posts;
      setUser(targetUser);
      setPosts(authoredPosts);
      setIsFollowing(targetUser.isFollowing ?? false);
      setFollowerCount(targetUser.followerCount ?? 0);
      setFollowingCount(targetUser.followingCount ?? 0);
      setMyToken(token);
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
  }, [router, username]);

  const handleToggleFollow = useCallback(async () => {
    if (!myToken || followLoading || !user) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.users.unfollow(user.id, myToken);
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
      } else {
        await api.users.follow(user.id, myToken);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch {
      // エラーは無視（楽観的 UI）
    } finally {
      setFollowLoading(false);
    }
  }, [myToken, followLoading, isFollowing, user]);

  if (status === 'loading') {
    return <div style={{ padding: '80px 12px', textAlign: 'center', color: T.ink50 }}>読み込み中…</div>;
  }

  if (status === 'not-found' || !user) {
    return <div style={{ padding: '80px 12px', textAlign: 'center', color: T.ink50 }}>ユーザーが見つかりません</div>;
  }

  const postCount = posts.length;

  return (
    <div style={{ paddingBottom: 120 }}>
      {followListTab !== null && user && (
        <FollowListSheet
          userId={user.id}
          initialTab={followListTab}
          onClose={() => setFollowListTab(null)}
        />
      )}
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
          @{user.username}
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
            <ProfileStat value={formatCount(followerCount)} label="フォロワー" onClick={() => setFollowListTab('followers')} />
            <ProfileStat value={formatCount(followingCount)} label="フォロー中" onClick={() => setFollowListTab('following')} />
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 24, fontWeight: 500,
          color: T.ink, letterSpacing: '-0.01em', marginTop: 14,
        }}>
          {user.displayName}
        </div>
        <div style={{ fontSize: 13, color: T.ink50, marginTop: 2 }}>
          @{user.username}
        </div>

        <div style={{ fontSize: 12, color: T.ink70, lineHeight: 1.65, marginTop: 8 }}>
          {user.bio || 'このユーザーはまだ自己紹介を設定していません。'}
          {user.location ? <div>{user.location}</div> : null}
          {user.instagramUsername ? (
            <div>
              <a
                href={`https://www.instagram.com/${user.instagramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: T.terracotta, textDecoration: 'none', fontWeight: 500 }}
              >
                @{user.instagramUsername}
              </a>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {myToken && (
            <button
              onClick={() => { void handleToggleFollow(); }}
              disabled={followLoading}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 999,
                background: isFollowing ? T.paper : T.ink,
                color: isFollowing ? T.ink : T.cream,
                border: isFollowing ? `1px solid ${T.hairlineStrong}` : 'none',
                fontSize: 12.5, fontWeight: 600, cursor: followLoading ? 'wait' : 'pointer', fontFamily: 'inherit',
                opacity: followLoading ? 0.7 : 1,
              }}
            >
              {isFollowing ? 'フォロー中' : 'フォローする'}
            </button>
          )}
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

function ProfileStat({ value, label, onClick }: { value: string; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        textAlign: 'center',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'inherit',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-serif, serif)',
        fontSize: 28,
        lineHeight: 1,
        color: T.ink,
      }}>
        {value}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: T.ink50 }}>{label}</div>
    </button>
  );
}

function FollowListSheet({
  userId,
  initialTab,
  onClose,
}: {
  userId: string;
  initialTab: 'followers' | 'following';
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'followers' | 'following'>(initialTab);
  const [followers, setFollowers] = useState<UserPublic[] | null>(null);
  const [following, setFollowing] = useState<UserPublic[] | null>(null);

  useEffect(() => {
    if (tab === 'followers' && followers === null) {
      api.users.getFollowers(userId).then(setFollowers).catch(() => setFollowers([]));
    }
    if (tab === 'following' && following === null) {
      api.users.getFollowing(userId).then(setFollowing).catch(() => setFollowing([]));
    }
  }, [tab, userId, followers, following]);

  const list = tab === 'followers' ? followers : following;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(31,26,20,0.4)',
        }}
      />
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 101,
        background: T.paper,
        borderRadius: '20px 20px 0 0',
        maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -4px 24px rgba(31,26,20,0.12)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 0',
        }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {(['followers', 'following'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? T.ink : T.ink50,
                  cursor: 'pointer',
                  borderBottom: tab === t ? `2px solid ${T.ink}` : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {t === 'followers' ? 'フォロワー' : 'フォロー中'}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 16,
              background: T.cream, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ borderBottom: `1px solid ${T.hairline}`, margin: '0 16px' }} />

        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0 24px' }}>
          {list === null ? (
            <div style={{ padding: '24px', textAlign: 'center', color: T.ink50, fontSize: 13 }}>読み込み中…</div>
          ) : list.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: T.ink50, fontSize: 13 }}>
              {tab === 'followers' ? 'フォロワーはいません' : 'フォロー中のユーザーはいません'}
            </div>
          ) : (
            list.map((u) => (
              <Link
                key={u.id}
                href={`/users/${u.username}`}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 22, flexShrink: 0,
                  background: T.cream,
                  border: `1px solid ${T.hairline}`,
                  overflow: 'hidden', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {u.avatarUrl ? (
                    <Image src={u.avatarUrl} alt={u.displayName} fill sizes="44px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 20, color: T.ink }}>
                      {u.displayName.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{u.displayName}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
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
        {resolveBreedName(dog.breed, dog.breedShortName, { compact: true })}
        {dog.weightKg != null ? ` · ${dog.weightKg}kg` : ''}
      </div>
    </div>
  );
}

// PostDog / PostAuthor にはInstagramデータが含まれないため、フォールバック時はnullとする
function fallbackDogsFromPosts(posts: Post[], ownerDisplayName: string): PublicDog[] {
  const dogMap = new Map<string, PublicDog>();
  posts.forEach((post) => {
    if (!dogMap.has(post.dogId)) {
      dogMap.set(post.dogId, {
        id: post.dogId,
        name: post.dog?.name ?? 'わんこ',
        breed: post.dog?.breed ?? '不明',
        breedShortName:
          post.dog?.breedShortName ?? post.dog?.breed ?? '不明',
        gender: null,
        weightKg: post.dog?.weightKg ?? null,
        chestCm: null,
        coatColors: [],
        photoUrl: post.dog?.photoUrl ?? null,
        ownerDisplayName,
        ownerInstagramUsername: null,
        bio: null,
        instagramUsername: null,
        birthYear: null,
        birthMonth: null,
      });
    }
  });
  return Array.from(dogMap.values());
}
