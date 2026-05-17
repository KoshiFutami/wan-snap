'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '../lib/api';
import { getValidToken } from '../lib/auth-store';

type UseLikeOptions = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
};

type UseLikeResult = {
  liked: boolean;
  likeCount: number;
  handleLike: () => Promise<void>;
};

export function useLike({ postId, initialLiked, initialCount }: UseLikeOptions): UseLikeResult {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  const handleLike = async () => {
    const token = await getValidToken();
    if (!token) {
      router.push('/auth/sign-in');
      return;
    }
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : c - 1));
    try {
      if (next) {
        await api.posts.like(postId, token);
      } else {
        await api.posts.unlike(postId, token);
      }
    } catch (error) {
      if (next && error instanceof ApiError && error.status === 409) {
        setLikeCount((c) => c - 1);
        return;
      }
      if (!next && error instanceof ApiError && error.status === 404) {
        setLikeCount((c) => c + 1);
        return;
      }
      // ロールバック
      setLiked(!next);
      setLikeCount((c) => (next ? c - 1 : c + 1));
    }
  };

  return { liked, likeCount, handleLike };
}
