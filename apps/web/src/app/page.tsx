import { api } from '../lib/api';
import { PostCard } from '../components/post-card';

export const revalidate = 30;

export default async function HomePage() {
  const { posts } = await api.posts.list({ limit: 20 }).catch(() => ({ posts: [], nextCursor: null }));

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <span className="text-6xl">🐾</span>
        <p className="mt-4 text-lg font-bold text-text-sub">まだスナップがありません</p>
        <p className="mt-1 text-sm text-text-muted">最初のスナップを投稿してみましょう</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-warm">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
