'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Dog } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';
import { ImageCropEditor } from '../../../components/image-crop-editor';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const inputStyle: CSSProperties = {
  width: '100%',
  background: T.paper,
  borderRadius: 12,
  border: `1px solid ${T.hairline}`,
  padding: '0 14px',
  height: 46,
  fontSize: 14,
  color: T.ink,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function NewPostPage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [dogId, setDogId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropEditor, setShowCropEditor] = useState(false);
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
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImageSrc(ev.target?.result as string);
      setShowCropEditor(true);
    };
    reader.readAsDataURL(file);
    // input をリセットして同一ファイルを再選択できるようにする
    e.target.value = '';
  };

  const handleCropComplete = (blob: Blob, previewUrl: string) => {
    setImageFile(new File([blob], 'image.jpg', { type: 'image/jpeg' }));
    setImagePreview(previewUrl);
    setShowCropEditor(false);
  };

  const handleCropCancel = () => {
    setShowCropEditor(false);
    setRawImageSrc(null);
  };

  const handleReselect = () => {
    if (rawImageSrc) {
      setShowCropEditor(true);
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

  if (dogs.length === 0 && !loading) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill={T.ink10} style={{ margin: '0 auto' }}>
          <ellipse cx="6" cy="9" rx="2" ry="2.6" />
          <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
          <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
          <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
          <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
        </svg>
        <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: T.ink70 }}>投稿するには先に愛犬を登録してください</p>
        <button
          onClick={() => router.push('/dogs/new')}
          style={{
            marginTop: 20,
            padding: '13px 24px',
            borderRadius: 999,
            background: T.ink,
            color: T.cream,
            fontSize: 13.5,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          愛犬を登録する
        </button>
      </div>
    );
  }

  return (
    <>
    {showCropEditor && rawImageSrc && (
      <ImageCropEditor
        imageSrc={rawImageSrc}
        onComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    )}
    <div style={{ padding: '8px 20px 120px' }}>
      {/* タイトル */}
      <div style={{ marginBottom: 20, paddingTop: 8 }}>
        <div
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 22,
            fontWeight: 500,
            color: T.ink,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
          }}
        >
          新しいスナップ
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 画像アップロード */}
        <div>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              aspectRatio: '4/5',
              borderRadius: 18,
              overflow: 'hidden',
              cursor: 'pointer',
              background: imagePreview ? 'transparent' : T.ink10,
              border: imagePreview ? 'none' : `2px dashed ${T.ink30}`,
              position: 'relative',
            }}
          >
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="プレビュー" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* 編集・変更ボタン */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    display: 'flex',
                    gap: 6,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {rawImageSrc && (
                    <button
                      type="button"
                      onClick={handleReselect}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(10,8,6,0.72)',
                        color: '#FFFEFB',
                        fontSize: 11.5,
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      編集
                    </button>
                  )}
                  <label
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: 'rgba(10,8,6,0.72)',
                      color: '#FFFEFB',
                      fontSize: 11.5,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    変更
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, textAlign: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke={T.ink50} strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" stroke={T.ink50} strokeWidth="1.5" />
                  <circle cx="17" cy="8" r="1.2" fill={T.ink50} />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.ink70 }}>写真を選ぶ</span>
                <span style={{ fontSize: 11, color: T.ink50 }}>タップして選択</span>
              </div>
            )}
            {!imagePreview && <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />}
          </label>
        </div>

        {/* 画像URL（代替）*/}
        {!imagePreview && (
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 6 }}>
              画像URL{' '}
              <span style={{ fontSize: 10, fontWeight: 400, color: T.ink50 }}>（ファイル未選択時）</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>
        )}

        {/* 愛犬セレクター */}
        {dogs.length > 0 && (
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 8 }}>
              愛犬 <span style={{ color: T.terracotta }}>*</span>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 0', scrollbarWidth: 'none' }}>
              {dogs.map((dog) => (
                <button
                  key={dog.id}
                  type="button"
                  onClick={() => setDogId(dog.id)}
                  style={{
                    padding: '6px 14px 6px 6px',
                    borderRadius: 999,
                    background: dogId === dog.id ? T.ink : T.paper,
                    color: dogId === dog.id ? T.cream : T.ink,
                    border: `1px solid ${dogId === dog.id ? T.ink : T.hairline}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      background: dogId === dog.id ? T.ink50 : T.ink10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={dogId === dog.id ? T.cream : T.ink50}>
                      <ellipse cx="6" cy="9" rx="2" ry="2.6" />
                      <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
                      <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
                      <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
                      <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{dog.name}</span>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>{dog.breed}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* キャプション */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 11.5, fontWeight: 500, color: T.ink }}>キャプション</label>
            <span style={{ fontSize: 10, color: T.ink50 }}>{caption.length} / 500</span>
          </div>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={500}
            placeholder="今日のコーデ！Mサイズでぴったりでした"
            style={{
              ...inputStyle,
              height: 'auto',
              padding: '12px 14px',
              resize: 'none',
              lineHeight: 1.55,
            }}
          />
        </div>

        {/* タグ */}
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: T.ink, marginBottom: 6 }}>
            タグ{' '}
            <span style={{ fontSize: 10, fontWeight: 400, color: T.ink50 }}>カンマ区切り</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="柴犬, ハーネス, 秋コーデ"
            style={inputStyle}
          />
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(185,90,61,0.08)',
              border: `1px solid rgba(185,90,61,0.2)`,
              fontSize: 12.5,
              color: T.terracotta,
            }}
          >
            {error}
          </div>
        )}

        {/* 固定CTAフッター */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px 32px',
            background: `linear-gradient(180deg, transparent, ${T.cream} 30%)`,
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              maxWidth: 350,
              display: 'flex',
              margin: '0 auto',
              padding: '14px 22px',
              borderRadius: 999,
              background: T.ink,
              color: T.cream,
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontFamily: 'inherit',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '0.02em',
            }}
          >
            {loading ? '投稿中...' : 'シェアする'}
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
