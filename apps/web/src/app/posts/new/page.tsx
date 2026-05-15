'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Dog } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';

export default function NewPostPage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [dogId, setDogId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getValidToken().then((token) => {
      if (!token) { router.push('/auth/sign-in'); return; }
      api.dogs.list(token).then((list) => {
        setDogs(list);
        if (list.length > 0) setDogId(list[0].id);
      }).catch(() => {});
    });
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getValidToken();
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

  const inputClass = "w-full rounded-2xl border-2 border-border-warm bg-white px-4 py-3 text-sm font-medium text-text-main placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors";

  if (dogs.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-sm py-12 text-center">
        <span className="text-5xl">🐾</span>
        <p className="mt-4 font-bold text-text-sub mb-4">投稿するには先に愛犬を登録してください</p>
        <button
          onClick={() => router.push('/dogs/new')}
          className="rounded-2xl px-6 py-3 text-sm font-black text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 6px 20px rgba(255,107,53,0.4)' }}
        >
          愛犬を登録する
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-text-main">📸 スナップを投稿する</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 画像アップロードエリア */}
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-2">写真 *</label>
          <label
            className="flex flex-col items-center justify-center w-full aspect-square rounded-3xl cursor-pointer transition-all"
            style={{
              border: '3px dashed #FF6B35',
              background: imagePreview ? 'transparent' : 'linear-gradient(135deg, #FFF5F0, #FFF0F8)',
            }}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="プレビュー" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <span className="text-5xl">📷</span>
                <span className="text-sm font-bold text-primary">写真を選ぶ</span>
                <span className="text-xs text-text-muted">タップして選択・自動でWebP変換されます</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* 画像URL（代替） */}
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">
            画像URL <span className="font-medium normal-case text-text-muted">（ファイル未選択時のみ）</span>
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* 愛犬 */}
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">愛犬 *</label>
          <select
            required
            value={dogId}
            onChange={(e) => setDogId(e.target.value)}
            className={inputClass}
          >
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>
                {dog.name}（{dog.breed}）
              </option>
            ))}
          </select>
        </div>

        {/* キャプション */}
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">キャプション</label>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={1000}
            className={`${inputClass} resize-none`}
            placeholder="今日のコーデ！Lサイズでぴったりでした 🐾"
          />
        </div>

        {/* タグ */}
        <div>
          <label className="block text-xs font-black text-text-sub uppercase tracking-widest mb-1.5">タグ（カンマ区切り）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClass}
            placeholder="柴犬, ハーネス, 秋コーデ"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-3 text-sm font-black text-white transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #EF476F)', boxShadow: '0 6px 20px rgba(255,107,53,0.4)' }}
        >
          {loading ? '投稿中...' : 'シェアする ✨'}
        </button>
      </form>
    </div>
  );
}
