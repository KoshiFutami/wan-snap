'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api, type Notification, type NotificationType } from '../../lib/api';
import { getValidToken } from '../../lib/auth-store';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink70: '#4A4540',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  forest: '#3D6B4F',
  ochre: '#B8860B',
  hairline: 'rgba(31,26,20,0.08)',
};

type FilterTab = 'all' | 'unread' | 'like' | 'comment' | 'follow';

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}週間前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

function groupByDate(notifications: Notification[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 30);

  const groups: { label: string; items: Notification[] }[] = [];

  const todayItems = notifications.filter((n) => new Date(n.createdAt) >= today);
  const weekItems = notifications.filter((n) => {
    const d = new Date(n.createdAt);
    return d >= weekAgo && d < today;
  });
  const monthItems = notifications.filter((n) => {
    const d = new Date(n.createdAt);
    return d >= monthAgo && d < weekAgo;
  });
  const olderItems = notifications.filter((n) => new Date(n.createdAt) < monthAgo);

  if (todayItems.length > 0) groups.push({ label: '今日', items: todayItems });
  if (weekItems.length > 0) groups.push({ label: '今週', items: weekItems });
  if (monthItems.length > 0) groups.push({ label: '今月', items: monthItems });
  if (olderItems.length > 0) groups.push({ label: 'それ以前', items: olderItems });

  return groups;
}

function LikeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="#fff">
      <path d="M6 11s-4-2.5-4-5.5C2 4 3 3 4.3 3c.9 0 1.4.5 1.7 1 .3-.5.8-1 1.7-1C9 3 10 4 10 5.5 10 8.5 6 11 6 11z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2 3h8v5H6L4 9.5V8H2V3z" fill="#fff" />
    </svg>
  );
}

function FollowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="4.5" r="2" fill="#fff" />
      <path d="M2 11c.5-2 2-3 4-3s3.5 1 4 3" stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}

function NotifTypeIcon({ type }: { type: NotificationType }) {
  if (type === 'like') return <LikeIcon />;
  if (type === 'comment') return <CommentIcon />;
  return <FollowIcon />;
}

function notifColor(type: NotificationType) {
  if (type === 'like') return T.terracotta;
  if (type === 'comment') return T.forest;
  return T.ochre;
}

function notifText(type: NotificationType) {
  if (type === 'like') return 'があなたのスナップにいいねしました';
  if (type === 'comment') return 'があなたのスナップにコメントしました';
  return 'があなたをフォローしました';
}

function notifTarget(n: Notification): string {
  if (n.type === 'follow') return `/users/${n.actor.username}`;
  if (n.post) return `/posts/${n.post.id}`;
  return '/';
}

function NotifRow({ n, onFollow }: { n: Notification; onFollow: (actorId: string) => void }) {
  const color = notifColor(n.type);
  const target = notifTarget(n);
  const [following, setFollowing] = useState(n.actor.isFollowing ?? false);

  const handleFollowClick = async () => {
    if (following) return;
    setFollowing(true);
    await onFollow(n.actor.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        background: n.isRead ? 'transparent' : 'rgba(185,90,61,0.04)',
      }}
    >
      <Link href={`/users/${n.actor.username}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            background: T.paper,
            border: `1px solid ${T.hairline}`,
            position: 'relative',
          }}
        >
          {n.actor.avatarUrl ? (
            <Image
              src={n.actor.avatarUrl}
              alt={n.actor.displayName}
              fill
              style={{ borderRadius: 19, objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 19,
                background: T.cream,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: -3,
              right: -3,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${T.cream}`,
            }}
          >
            <NotifTypeIcon type={n.type} />
          </div>
        </div>
      </Link>

      <Link href={target} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
        <div style={{ fontSize: 12.5, color: T.ink, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>{n.actor.displayName}</span>
          <span style={{ color: T.ink70 }}> {notifText(n.type)}</span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: T.ink50,
            marginTop: 3,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {formatRelativeTime(n.createdAt)}
        </div>
      </Link>

      {n.post && (
        <Link href={`/posts/${n.post.id}`} style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              background: T.cream,
            }}
          >
            <Image
              src={n.post.imageUrl}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Link>
      )}

      {n.type === 'follow' && (
        <button
          onClick={handleFollowClick}
          disabled={following}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            background: following ? 'transparent' : T.ink,
            color: following ? T.ink50 : T.cream,
            border: following ? `1.5px solid ${T.hairline}` : 'none',
            fontSize: 11,
            fontWeight: 600,
            flexShrink: 0,
            cursor: following ? 'default' : 'pointer',
          }}
        >
          {following ? 'フォロー済み' : 'フォロー'}
        </button>
      )}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '12px 20px 4px',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: T.ink50,
      }}
    >
      {label}
    </div>
  );
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'unread', label: '未読' },
  { key: 'like', label: 'いいね' },
  { key: 'comment', label: 'コメント' },
  { key: 'follow', label: 'フォロー' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FilterTab>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 初回マウント時のみ一括既読処理
  useEffect(() => {
    (async () => {
      const token = await getValidToken();
      if (!token) return;
      const res = await api.notifications.list(token, { limit: 1 }).catch(() => null);
      if (res && res.unreadCount > 0) {
        await api.notifications.markAllRead(token).catch(() => undefined);
        setUnreadCount(0);
      } else if (res) {
        setUnreadCount(res.unreadCount);
      }
    })();
  }, []);

  // タブ切替で通知一覧を再取得
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getValidToken();
      if (!token) {
        router.push('/auth/sign-in');
        return;
      }
      setLoading(true);
      try {
        const params: Parameters<typeof api.notifications.list>[1] = {};
        if (tab === 'unread') params.unread = true;
        else if (tab !== 'all') params.type = tab as NotificationType;
        const res = await api.notifications.list(token, params);
        if (!cancelled) {
          setNotifications(res.notifications);
        }
      } catch {
        // 読み込み失敗は空リストのまま
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, router]);

  const handleFollow = async (actorId: string) => {
    const token = await getValidToken();
    if (!token) return;
    try {
      await api.users.follow(actorId, token);
    } catch {
      // already following
    }
  };

  const groups = groupByDate(notifications);

  return (
    <div style={{ minHeight: '100dvh', background: T.cream }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 4px', paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.ink50,
            fontWeight: 500,
          }}
        >
          {unreadCount > 0 ? `Notifications · ${unreadCount} new` : 'Notifications'}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-jp-body)',
            fontSize: 28,
            fontWeight: 500,
            color: T.ink,
            lineHeight: 1,
            marginTop: 4,
            letterSpacing: '-0.01em',
          }}
        >
          お知らせ
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          padding: '14px 20px 8px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 14px',
              borderRadius: 999,
              border: `1.5px solid ${tab === key ? T.ink : T.hairline}`,
              background: tab === key ? T.ink : T.paper,
              color: tab === key ? T.cream : T.ink50,
              fontSize: 12,
              fontWeight: tab === key ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {key === 'unread' && unreadCount > 0 && (
              <span
                style={{
                  background: T.terracotta,
                  color: '#fff',
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  fontSize: 8.5,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ paddingBottom: 100 }}>
        {loading ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: T.ink50,
              fontSize: 13,
            }}
          >
            読み込み中...
          </div>
        ) : groups.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: T.ink50,
              fontSize: 13,
            }}
          >
            お知らせはありません
          </div>
        ) : (
          groups.map(({ label, items }) => (
            <div key={label}>
              <SectionLabel label={label} />
              {items.map((n) => (
                <NotifRow key={n.id} n={n} onFollow={handleFollow} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
