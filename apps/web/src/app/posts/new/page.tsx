'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Dog } from '../../../lib/api';
import { getAccessToken } from '../../../lib/auth-store';

export default function NewPostPage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [dogId, setDogId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { router.push('/auth/sign-in'); return; }
    api.dogs.list(token).then((list) => {
      setDogs(list);
      if (list.length > 0) setDogId(list[0].id);
    }).catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) { router.push('/auth/sign-in'); return; }

    setError('');
    setLoading(true);
    try {
      let resolvedImageUrl = imageUrl.trim();
      if (imageFile) {
        const uploaded = await api.posts.uploadImage(imageFile, token);
        resolvedImageUrl = uploaded.imageUrl;
      }
      if (!resolvedImageUrl) {
        throw new Error('画像ファイルまたは画像URLを指定してください');
      }

      const post = await api.posts.create(
        {
          dogId,
          imageUrl: resolvedImageUrl,
          caption: caption || undefined,
          tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        },
        token,
      );
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (dogs.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-sm py-12 text-center">
        <p className="text-gray-600 mb-4">投稿するには先に愛犬を登録してください</p>
        <button
          onClick={() => router.push('/dogs/new')}
          className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          愛犬を登録する
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">スナップを投稿する</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">愛犬 *</label>
          <select
            required
            value={dogId}
            onChange={(e) => setDogId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none bg-white"
          >
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>
                {dog.name}（{dog.breed}）
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">画像ファイル</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">選択した画像はアップロード時に自動で WebP 変換されます</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">画像URL（任意）</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-gray-400">画像ファイルを選ばない場合のみ指定してください</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">キャプション</label>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={1000}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none resize-none"
            placeholder="今日のコーデ！Lサイズでぴったりでした"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タグ（カンマ区切り）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
            placeholder="柴犬, ハーネス, 秋コーデ"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? '投稿中...' : '投稿する'}
        </button>
      </form>
    </div>
  );
}
