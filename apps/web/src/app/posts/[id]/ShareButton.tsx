'use client';

import { useShare } from '../../../hooks/useShare';

const T = {
  ink: '#1F1A14',
  paper: '#FFFEFB',
  forest: '#3F5A40',
  hairline: 'rgba(31,26,20,0.08)',
};

type Props = { postId: string };

export function ShareButton({ postId }: Props) {
  const { shared, handleShare } = useShare(postId);

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: 19,
        background: shared ? `rgba(63,90,64,0.12)` : T.paper,
        border: shared ? `1px solid ${T.forest}` : `1px solid ${T.hairline}`,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      aria-label={shared ? 'URLをコピーしました' : 'シェア'}
    >
      {shared ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L19 7" stroke={T.forest} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v13M7 8l5-5 5 5M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
