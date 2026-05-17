'use client';

import type { CSSProperties } from 'react';
import type { EditableItem } from './item-editor-section';

const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
};

type ItemTagOverlayProps = {
  xPct: number;
  yPct: number;
  brand: string | null;
  category: string;
  productName: string | null;
  isOpen?: boolean;
  onToggle?: () => void;
};

export function ItemTagOverlay({
  xPct,
  yPct,
  brand,
  category,
  productName,
  isOpen,
  onToggle,
}: ItemTagOverlayProps) {
  const tappable = Boolean(onToggle);
  const showLabel = !tappable || isOpen;
  const side = xPct > 50 ? 'left' : 'right';
  const label = productName ?? category;
  const meta = brand ?? category;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: tappable ? 'auto' : 'none',
      }}
    >
      {tappable && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            left: -16,
            top: -16,
            borderRadius: 999,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            zIndex: 1,
          }}
          aria-label={`${label}のタグを${isOpen ? '閉じる' : '表示'}`}
        />
      )}
      <div
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: 999,
          background: T.paper,
          border: `2px solid ${T.ink}`,
          left: -5,
          top: -5,
          boxShadow: '0 0 0 4px rgba(31,26,20,0.15)',
        }}
      />
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            width: 22,
            height: 1,
            background: T.paper,
            left: side === 'right' ? 5 : -27,
            top: -0.5,
            opacity: 0.95,
          }}
        />
      )}
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            left: side === 'right' ? 27 : 'auto',
            right: side === 'left' ? 27 : 'auto',
            top: -16,
            background: T.paper,
            padding: '6px 10px 7px',
            borderRadius: 6,
            boxShadow: '0 2px 14px rgba(31,26,20,0.18)',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 8.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: T.ink50,
              fontWeight: 600,
              marginBottom: 1,
            }}
          >
            {meta}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: T.ink,
              lineHeight: 1.1,
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

type PhotoTagCanvasProps = {
  imageUrl: string;
  items: EditableItem[];
  placingItemKey: string | null;
  onPlace: (key: string, xPct: number, yPct: number) => void;
  onClearPosition: (key: string) => void;
};

const imageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: 'auto',
};

export function PhotoTagCanvas({
  imageUrl,
  items,
  placingItemKey,
  onPlace,
  onClearPosition,
}: PhotoTagCanvasProps) {
  const placedItems = items.filter(
    (item) => item.xPct != null && item.yPct != null,
  );

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!placingItemKey) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onPlace(
      placingItemKey,
      Math.min(100, Math.max(0, Number(x.toFixed(2)))),
      Math.min(100, Math.max(0, Number(y.toFixed(2)))),
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        background: T.cream,
        border: `1px solid ${T.hairline}`,
      }}
    >
      <div style={{ position: 'relative' }} onClick={handleCanvasClick}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="アイテム配置用プレビュー" style={imageStyle} />

        {placingItemKey && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '6px 10px',
              borderRadius: 999,
              background: 'rgba(185,90,61,0.92)',
              color: T.paper,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.03em',
              boxShadow: '0 10px 24px rgba(31,26,20,0.18)',
            }}
          >
            タップして配置
          </div>
        )}

        {placedItems.map((item) => (
          <button
            key={item._key}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (!placingItemKey) onClearPosition(item._key);
            }}
            disabled={Boolean(placingItemKey)}
            aria-label={`${item.productName ?? item.brand ?? item.category}の位置をクリア`}
            style={{
              position: 'absolute',
              left: `${item.xPct}%`,
              top: `${item.yPct}%`,
              transform: 'translate(-50%, -50%)',
              width: 22,
              height: 22,
              borderRadius: 999,
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: placingItemKey ? 'default' : 'pointer',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 10,
                height: 10,
                margin: '6px auto',
                borderRadius: 999,
                background: T.paper,
                border: `2px solid ${T.ink}`,
                boxShadow: '0 0 0 4px rgba(31,26,20,0.15)',
              }}
            />
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 12px',
          borderTop: `1px solid ${T.hairline}`,
          background: 'rgba(255,254,251,0.92)',
        }}
      >
        <div style={{ fontSize: 11.5, color: T.ink }}>
          {placingItemKey
            ? '写真をタップして位置を確定'
            : '白いドットをタップすると位置をクリアできます'}
        </div>
        <div style={{ fontSize: 10.5, color: T.ink50 }}>
          配置済み {placedItems.length}/{items.length}
        </div>
      </div>
    </div>
  );
}
