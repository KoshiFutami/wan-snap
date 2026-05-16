'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAccessToken, getValidToken } from '../../../lib/auth-store';
import { api } from '../../../lib/api';

const T = {
  ink: '#1F1A14',
  cream: '#F4EDE0',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

export function FollowButton({
  authorId,
}: {
  authorId: string;
}) {
  const [myId, setMyId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const accessToken = getAccessToken();
    if (!accessToken) return;
    getValidToken()
      .then(async (t) => {
        if (!t || cancelled) return;
        setToken(t);
        const me = await api.users.getMe(t).catch(() => null);
        if (!me || me.id === authorId || cancelled) return;
        setMyId(me.id);
        const userInfo = await api.users.getById(authorId, t).catch(() => null);
        if (!cancelled && userInfo) setIsFollowing(userInfo.isFollowing ?? false);
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, [authorId]);

  const handleToggle = useCallback(async () => {
    if (!token || loading || !myId) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await api.users.unfollow(authorId, token);
        setIsFollowing(false);
      } else {
        await api.users.follow(authorId, token);
        setIsFollowing(true);
      }
    } catch {
      // エラーは無視
    } finally {
      setLoading(false);
    }
  }, [token, loading, myId, isFollowing, authorId]);

  // 自分の投稿または未ログインの場合は表示しない
  if (!myId) return null;

  return (
    <button
      onClick={() => { void handleToggle(); }}
      disabled={loading}
      style={{
        padding: '6px 14px',
        borderRadius: 999,
        background: isFollowing ? 'transparent' : T.ink,
        color: isFollowing ? T.ink : T.cream,
        border: `1px solid ${isFollowing ? T.hairlineStrong : T.ink}`,
        fontSize: 11.5,
        fontWeight: 600,
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit',
        opacity: loading ? 0.7 : 1,
        flexShrink: 0,
      }}
    >
      {isFollowing ? 'フォロー中' : 'フォロー'}
    </button>
  );
}
