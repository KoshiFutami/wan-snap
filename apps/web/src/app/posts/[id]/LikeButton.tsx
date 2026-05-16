'use client';

import { useLike } from '../../../hooks/useLike';

const T = {
  ink: '#1F1A14',
  terracotta: '#B95A3D',
};

type Props = {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
};

export function LikeButton({ postId, initialCount, initialLiked }: Props) {
  const { liked, likeCount: count, handleLike } = useLike({
    postId,
    initialLiked,
    initialCount,
  });

  return (
    <button
      onClick={handleLike}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        width: 'auto',
        minWidth: 38,
        height: 38,
        borderRadius: 19,
        padding: '0 10px',
        background: liked ? T.terracotta : 'rgba(255,255,255,0.92)',
        border: liked ? 'none' : '1px solid rgba(31,26,20,0.12)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        justifyContent: 'center',
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: liked ? '#fff' : T.ink,
      }}
      aria-label={liked ? 'いいね取消' : 'いいね'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#fff' : 'none'}>
        <path
          d="M12 20.5s-7.5-4.7-7.5-10.2c0-2.7 2-4.8 4.5-4.8 1.8 0 2.7 1 3 1.7.3-.7 1.2-1.7 3-1.7 2.5 0 4.5 2.1 4.5 4.8 0 5.5-7.5 10.2-7.5 10.2z"
          stroke={liked ? '#fff' : T.ink}
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
