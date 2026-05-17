'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Dog } from '../../../lib/api';
import { getValidToken } from '../../../lib/auth-store';
import { ImageCropEditor } from '../../../components/image-crop-editor';
import { PhotoTagCanvas } from '../../../components/photo-tag-canvas';
import { ItemEditorSection, validateItems, type EditableItem } from '../../../components/item-editor-section';

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

const IMAGE_TAG_HINT_VERTICAL_POSITION = '78%';
const UNSET_DETAIL_TEXT = '未設定';

const imageActionButtonStyle: CSSProperties = {
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
};

function normalizeTagInput(value: string): string[] {
  return [...new Set(value.split(',').map((tag) => tag.trim()).filter(Boolean))];
}

export default function NewPostPage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [dogId, setDogId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [items, setItems] = useState<EditableItem[]>([]);
  const [placingItemKey, setPlacingItemKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const settingRows = [
    { label: '場所', detail: UNSET_DETAIL_TEXT },
    { label: 'サイズ感', detail: UNSET_DETAIL_TEXT },
    { label: '公開範囲', detail: '全員に公開' },
  ];

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
    setPlacingItemKey(null);
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

  const handlePlaceItem = (key: string, xPct: number, yPct: number) => {
    setItems((current) =>
      current.map((item) => (item._key === key ? { ...item, xPct, yPct } : item)),
    );
    setPlacingItemKey(null);
  };

  const handleClearItemPosition = (key: string) => {
    setItems((current) =>
      current.map((item) =>
        item._key === key ? { ...item, xPct: null, yPct: null } : item,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) { router.push('/auth/sign-in'); return; }

    const urlError = validateItems(items);
    if (urlError) { setError(urlError); return; }
    setError('');
    setLoading(true);
    try {
      if (!dogId) {
        throw new Error('投稿する愛犬を選択してください');
      }
      if (!imageFile) {
        throw new Error('投稿する画像を選択してください');
      }
      const uploaded = await api.posts.uploadImage(imageFile, token);

      const post = await api.posts.create(
        {
          dogId,
          imageUrl: uploaded.imageUrl,
          imageWidth: uploaded.imageWidth,
          imageHeight: uploaded.imageHeight,
          caption: caption || undefined,
          tags: normalizeTagInput(tags),
          items: items.map(({ _key: _k, ...rest }) => rest),
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

  return (
    <>
      {showCropEditor && rawImageSrc && (
        <ImageCropEditor
          imageSrc={rawImageSrc}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      <form
        id="new-post-form"
        onSubmit={handleSubmit}
        style={{ minHeight: '100dvh', background: T.cream }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: T.cream,
            borderBottom: `1px solid ${T.hairline}`,
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: T.paper,
              border: `1px solid ${T.hairline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="閉じる"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, color: T.ink }}>
            新しいスナップ
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              background: loading ? T.ink10 : T.ink,
              color: loading ? T.ink50 : T.cream,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            {loading ? '投稿中…' : '投稿'}
          </button>
        </div>
        <div style={{ padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 画像アップロード */}
          <div>
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <PhotoTagCanvas
                  imageUrl={imagePreview}
                  items={items}
                  placingItemKey={placingItemKey}
                  onPlace={handlePlaceItem}
                  onClearPosition={handleClearItemPosition}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 52,
                    right: 12,
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  {rawImageSrc && (
                    <button
                      type="button"
                      onClick={handleReselect}
                      style={imageActionButtonStyle}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      編集
                    </button>
                  )}
                  <label style={imageActionButtonStyle}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    変更
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            ) : (
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
                  background: T.ink10,
                  border: `2px dashed ${T.ink30}`,
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, textAlign: 'center', marginTop: 72 }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="3" stroke={T.ink50} strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke={T.ink50} strokeWidth="1.5" />
                      <circle cx="17" cy="8" r="1.2" fill={T.ink50} />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.ink70 }}>写真を選ぶ</span>
                    <span style={{ fontSize: 11, color: T.ink50 }}>タップして選択</span>
                  </div>
                  <div style={{ position: 'absolute', left: '50%', top: IMAGE_TAG_HINT_VERTICAL_POSITION, transform: 'translateX(-50%)' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: 'rgba(255,254,251,0.85)',
                      backdropFilter: 'blur(8px)',
                      border: `2px dashed ${T.terracotta}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: T.terracotta,
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                    >
                      +
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: -28,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: T.terracotta,
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                    >
                      タップして写真を選ぶ
                    </div>
                  </div>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>

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

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <label htmlFor="post-tags" style={{ fontSize: 11.5, fontWeight: 500, color: T.ink }}>タグ</label>
            <span style={{ fontSize: 10, color: T.ink50 }}>カンマ区切りで追加</span>
          </div>
          <input
            id="post-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例: トイプードル, テディベアカット, 春コーデ"
            style={inputStyle}
          />
        </div>

        {/* 愛犬セレクター */}
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
              <button
                type="button"
                onClick={() => router.push('/dogs/new')}
                style={{
                  padding: '8px 12px 8px 8px',
                  borderRadius: 999,
                  border: `1px dashed ${T.hairlineStrong}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: T.ink50,
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                + 新しい愛犬
              </button>
            </div>
          </div>

          {/* 着用アイテム */}
          <ItemEditorSection
            items={items}
            onChange={setItems}
            placingItemKey={placingItemKey}
            onSetPosition={setPlacingItemKey}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: T.paper,
              borderRadius: 14,
              border: `1px solid ${T.hairline}`,
              overflow: 'hidden',
            }}
          >
            {settingRows.map((row, index) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderBottom: index < settingRows.length - 1 ? `1px solid ${T.hairline}` : 'none',
                }}
              >
                <span style={{ fontSize: 12.5, color: T.ink70 }}>{row.label}</span>
                <span style={{ fontSize: 12, color: T.ink50 }}>{row.detail}</span>
              </div>
            ))}
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
        </div>
      </form>
    </>
  );
}
