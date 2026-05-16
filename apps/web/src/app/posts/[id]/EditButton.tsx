'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getValidToken } from '../../../lib/auth-store';
import { api } from '../../../lib/api';

const T = {
  ink: '#1F1A14',
  hairline: 'rgba(31,26,20,0.08)',
  cream: '#F4EDE0',
};

export function EditButton({ postId, authorId }: { postId: string; authorId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    getValidToken().then(async (token) => {
      if (!token) return;
      const me = await api.users.getMe(token).catch(() => null);
      if (me?.id === authorId) setShow(true);
    });
  }, [authorId]);

  if (!show) return null;

  return (
    <Link
      href={`/posts/${postId}/edit`}
      style={{
        width: 38, height: 38, borderRadius: 19,
        background: T.cream,
        border: `1px solid ${T.hairline}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none',
      }}
      aria-label="編集"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M14 2l4 4-10 10H4v-4L14 2z" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
