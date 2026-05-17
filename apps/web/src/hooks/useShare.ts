'use client';

import { useState } from 'react';

type UseShareResult = {
  shared: boolean;
  handleShare: () => Promise<void>;
};

export function useShare(postId: string): UseShareResult {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // キャンセルされた場合は何もしない
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // クリップボードが使えない環境では何もしない
    }
  };

  return { shared, handleShare };
}
