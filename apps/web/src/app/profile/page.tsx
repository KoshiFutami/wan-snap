'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens, getValidToken } from '../../lib/auth-store';
import { api, type User, type Dog, type Post, type UserPublic } from '../../lib/api';
import { resolveBreedName } from '../../lib/breed';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'snaps' | 'items' | 'saved'>('snaps');
  const [followListTab, setFollowListTab] = useState<'followers' | 'following' | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    setIsAuthed(true);
    getValidToken().then((t) => {
      if (!t) return;
      api.users.getMe(t).then((u) => {
        setUser(u);
        return Promise.all([
          api.dogs.list(t),
          api.posts.list({ limit: 20, authorId: u.id }, t),
          api.users.getMyBookmarks(t, { limit: 20 }),
        ]);
      }).then(([d, postResponse, bookmarkResponse]) => {
        setDogs(d);
        setPosts(postResponse.posts);
        setSavedPosts(bookmarkResponse.posts);
      }).catch(() => null);
    });
  }, []);

  const handleSignOut = () => {
    clearTokens();
    router.push('/');
  };

  const handleShare = async () => {
    const shareData = {
      title: `${user?.displayName ?? 'wansnap'}のプロフィール`,
      text: `${user?.displayName ?? 'wansnap'}のプロフィールをチェック`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      return;
    }
  };

  if (!isAuthed) {
    return (
      <div style={{ padding: '64px 12px', textAlign: 'center' }}>
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

  const handle = user?.username ? `@${user.username}` : '@wan_snap';
  const postCount = posts.length;
  const itemCount = posts.reduce((count, post) => count + post.items.length, 0);
  const dogNames = dogs.map((dog) => dog.name).join('・');
  const savedCount = savedPosts.length;

  return (
    <div style={{ paddingBottom: 120 }}>
      {followListTab !== null && user && (
        <FollowListSheet
          userId={user.id}
          initialTab={followListTab}
          onClose={() => setFollowListTab(null)}
        />
      )}
      {/* トップバー */}
      <div style={{
        padding: '8px 12px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>
          {handle}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/posts/new" style={{
            width: 36, height: 36, borderRadius: 18,
            background: T.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${T.hairline}`,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2v14M3 9l7-7 7 7" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            onClick={() => router.push('/profile/edit')}
            style={{
            width: 36, height: 36, borderRadius: 18,
            background: T.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${T.hairline}`,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke={T.ink} strokeWidth="1.5" />
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4 4l1.5 1.5M14.5 14.5L16 16M4 16l1.5-1.5M14.5 5.5L16 4"
                stroke={T.ink} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ユーザーヘッダー */}
      <div style={{ padding: '8px 12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* アバター */}
          <div style={{
            width: 76, height: 76, borderRadius: 38,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
          }}>
            {user?.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" fill sizes="76px" style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{
                fontFamily: 'var(--font-serif, serif)',
                fontSize: 34,
                lineHeight: 1,
                color: T.ink,
              }}>
                {(user?.displayName ?? 'W').slice(0, 1)}
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
            <ProfileStat value={user?.followerCount != null ? formatCount(user.followerCount) : '-'} label="フォロワー" onClick={user ? () => setFollowListTab('followers') : undefined} />
            <ProfileStat value={user?.followingCount != null ? formatCount(user.followingCount) : '-'} label="フォロー中" onClick={user ? () => setFollowListTab('following') : undefined} />
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
        {user?.username && (
          <div style={{ fontSize: 13, color: T.ink50, marginTop: 2 }}>
            @{user.username}
          </div>
        )}

        {/* bio / location */}
        <div style={{ fontSize: 12, color: T.ink70, lineHeight: 1.65, marginTop: 8 }}>
          {user?.bio || 'wansnapでうちの子のコーデ記録をまとめています。'}
          {dogNames ? <div>愛犬: {dogNames}</div> : null}
          {user?.location ? <div>{user.location}</div> : null}
          {user?.instagramUsername ? (
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
            onClick={handleShare}
            style={{
              padding: '9px 14px', borderRadius: 10,
              background: T.paper, color: T.ink,
              border: `1px solid ${T.hairlineStrong}`,
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            シェア
          </button>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            marginTop: 10,
            padding: 0,
            border: 'none',
            background: 'none',
            color: T.ink50,
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ログアウト
        </button>
      </div>

      {/* マイわんセクション */}
      <div style={{ marginTop: 28 }}>
        <div style={{
          padding: '0 12px 12px',
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
          display: 'flex', gap: 10, padding: '0 12px 4px',
          overflowX: 'auto',
        }}>
          {dogs.map((dog, i) => (
            <Link key={dog.id} href={`/dogs/${dog.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
              <DogCard dog={dog} active={i === 0} />
            </Link>
          ))}
          <DogCardPlaceholder />
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          borderBottom: `1px solid ${T.hairline}`,
        }}>
          <ProfileTab
            label="スナップ"
            count={postCount}
            active={activeTab === 'snaps'}
            onClick={() => setActiveTab('snaps')}
          />
          <ProfileTab
            label="アイテム"
            count={itemCount}
            active={activeTab === 'items'}
            onClick={() => setActiveTab('items')}
          />
          <ProfileTab
            label="保存"
            count={savedCount}
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          />
        </div>

        {activeTab === 'items' && itemCount > 0 ? (
          <div style={{ padding: '14px 12px 0', display: 'grid', gap: 10 }}>
            {posts.flatMap((post) =>
              post.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/posts/${post.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: T.paper,
                      border: `1px solid ${T.hairline}`,
                    }}
                  >
                    <div style={{ fontSize: 11, color: T.terracotta, fontWeight: 600 }}>{item.category}</div>
                    <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: T.ink }}>
                      {item.brand ?? 'ブランド未設定'}
                    </div>
                    {item.productName && (
                      <div style={{ marginTop: 2, fontSize: 12, color: T.ink70 }}>{item.productName}</div>
                    )}
                    <div style={{ marginTop: 6, fontSize: 11, color: T.ink50 }}>
                      {item.size ? `サイズ ${item.size}` : 'サイズ未設定'}
                      {item.fitNote ? ` · ${item.fitNote}` : ''}
                    </div>
                  </div>
                </Link>
              )),
            )}
          </div>
        ) : activeTab === 'snaps' && posts.length > 0 ? (
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
        ) : activeTab === 'saved' && savedPosts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 4,
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 12px 16px',
            overflow: 'hidden',
          }}>
            {savedPosts.map((post) => (
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
          <div style={{ padding: '18px 12px 0' }}>
            <EmptyPanel
              title={activeTab === 'snaps' ? 'まだ投稿はありません' : activeTab === 'items' ? 'まだアイテムがありません' : '保存はまだありません'}
              description={
                activeTab === 'snaps'
                  ? '最初のコーデスナップを投稿すると、ここに一覧で並びます。'
                  : activeTab === 'items'
                    ? '投稿に登録したアイテム数がここに反映されます。'
                    : '保存したスナップは今後ここから見返せるようにします。'
              }
              href={activeTab === 'snaps' ? '/posts/new' : undefined}
              cta={activeTab === 'snaps' ? '投稿する' : undefined}
            />
          </div>
        )}

      </div>
    </div>
  );
}

function formatCount(value: number): string {
  if (value >= 1000) {
    const rounded = Math.round((value / 1000) * 10) / 10;
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

function EmptyPanel({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  const content = (
    <div style={{
      padding: '18px 16px',
      borderRadius: 14,
      background: T.paper,
      border: `1px dashed ${T.hairlineStrong}`,
      color: T.ink,
    }}>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: T.ink50, lineHeight: 1.5 }}>{description}</div>
      {cta && <div style={{ marginTop: 10, fontSize: 12, color: T.terracotta, fontWeight: 600 }}>{cta}</div>}
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>;
  }

  return content;
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
        {resolveBreedName(dog.breed, dog.breedShortName, { compact: true })}
        {dog.weightKg != null ? ` · ${dog.weightKg}kg` : ''}
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
