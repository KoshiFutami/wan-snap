'use client';

import type { CSSProperties } from 'react';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

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
};

interface ImageCropEditorProps {
  imageSrc: string;
  onComplete: (croppedBlob: Blob, previewUrl: string) => void;
  onCancel: () => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/jpeg', 0.92);
  });
}

const ASPECT_OPTIONS = [
  { label: '4:5', value: 4 / 5 },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '自由', value: undefined },
] as const;

type AspectOption = typeof ASPECT_OPTIONS[number];

export function ImageCropEditor({ imageSrc, onComplete, onCancel }: ImageCropEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<AspectOption>(ASPECT_OPTIONS[0]);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setApplying(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(blob);
      onComplete(blob, previewUrl);
    } finally {
      setApplying(false);
    }
  };

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: '#0a0806',
    display: 'flex',
    flexDirection: 'column',
  };

  const cropAreaStyle: CSSProperties = {
    flex: 1,
    position: 'relative',
    minHeight: 0,
  };

  const controlsStyle: CSSProperties = {
    background: '#0a0806',
    padding: '16px 20px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };

  const sliderStyle: CSSProperties = {
    width: '100%',
    accentColor: T.cream,
    cursor: 'pointer',
  };

  return (
    <div style={overlayStyle}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ background: 'none', border: 'none', color: T.ink30, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0' }}
        >
          キャンセル
        </button>
        <span style={{ color: T.cream, fontSize: 13.5, fontWeight: 600 }}>写真を編集</span>
        <button
          type="button"
          onClick={handleApply}
          disabled={applying}
          style={{ background: 'none', border: 'none', color: applying ? T.ink50 : T.cream, fontSize: 14, fontWeight: 600, cursor: applying ? 'not-allowed' : 'pointer', fontFamily: 'inherit', padding: '4px 0' }}
        >
          {applying ? '処理中...' : '完了'}
        </button>
      </div>

      {/* クロップエリア */}
      <div style={cropAreaStyle}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={selectedAspect.value}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: '#0a0806' },
            cropAreaStyle: { border: '2px solid rgba(255,254,251,0.8)', borderRadius: 4 },
          }}
          showGrid={true}
          zoomSpeed={0.3}
        />
      </div>

      {/* コントロール */}
      <div style={controlsStyle}>
        {/* アスペクト比選択 */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedAspect(opt)}
              style={{
                padding: '5px 14px',
                borderRadius: 999,
                background: selectedAspect.label === opt.label ? T.cream : 'transparent',
                color: selectedAspect.label === opt.label ? T.ink : T.ink30,
                border: `1px solid ${selectedAspect.label === opt.label ? T.cream : 'rgba(255,254,251,0.2)'}`,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ズーム */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke={T.ink50} strokeWidth="1.8" />
            <path d="M11 8v6M8 11h6M20 20l-3-3" stroke={T.ink50} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{ fontSize: 11, color: T.ink50, minWidth: 32, textAlign: 'right' }}>{Math.round(zoom * 100)}%</span>
        </div>

        {/* 回転 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M20 8A9 9 0 1 0 20.5 14M20 3v5h-5" stroke={T.ink50} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{ fontSize: 11, color: T.ink50, minWidth: 32, textAlign: 'right' }}>{rotation}°</span>
        </div>
      </div>
    </div>
  );
}
