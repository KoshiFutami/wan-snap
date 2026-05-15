import { api } from '../lib/api';
import { PostCard } from '../components/post-card';

export const revalidate = 30;

export default async function HomePage() {
  const { posts } = await api.posts.list({ limit: 20 }).catch(() => ({ posts: [], nextCursor: null }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-text-main">スナップ一覧</h1>
        <p className="mt-1 text-sm text-text-sub">同じ犬種・体格のおしゃれを参考にしよう 🐾</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl"
          style={{ background: 'linear-gradient(135deg, #FFF5F0, #FFF0F8)' }}>
          <span className="text-6xl mb-4">🐾</span>
          <p className="text-lg font-bold text-text-sub">まだスナップがありません</p>
          <p className="mt-1 text-sm text-text-muted">最初のスナップを投稿してみましょう</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
