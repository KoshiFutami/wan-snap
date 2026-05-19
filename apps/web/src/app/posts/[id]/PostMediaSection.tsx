'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ItemTagOverlay } from '../../../components/photo-tag-canvas';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  paper: '#FFFEFB',
  creamSoft: '#FAF5EA',
  terracotta: '#B95A3D',
  forest: '#3F5A40',
  hairline: 'rgba(31,26,20,0.08)',
};

const itemColors = [T.terracotta, T.forest, '#7B6EA8', '#2E7D8A'];

const categoryLabels: Record<string, string> = {
  tops: 'トップス',
  bottoms: 'ボトムス',
  dress: 'ワンピース',
  outerwear: 'アウター',
  collar: '首輪',
  harness: 'ハーネス',
  leash: 'リード',
  bandana: 'バンダナ',
  hat: '帽子',
  shoes: 'シューズ',
  other: 'その他',
};

type Item = {
  id: string;
  xPct: number | null;
  yPct: number | null;
  brand: string | null;
  category: string;
  productName: string | null;
  size: string | null;
  fitNote: string | null;
  priceJpy: number | null;
  purchaseUrl: string | null;
};

type Props = {
  imageUrl: string;
  imageAlt: string;
  imageWidth: number | null;
  imageHeight: number | null;
  items: Item[];
  hasGrooming?: boolean;
};

export function PostMediaSection({ imageUrl, imageAlt, imageWidth, imageHeight, items, hasGrooming }: Props) {
  const positionedItems = items.filter(
    (item): item is Item & { xPct: number; yPct: number } =>
      item.xPct != null && item.yPct != null,
  );

  const [openId, setOpenId] = useState<string | null>(
    positionedItems.length > 1 ? positionedItems[0].id : null,
  );

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <>
      {/* メイン写真 */}
      <div style={{
        margin: '0 20px 16px',
        borderRadius: 20,
        overflow: 'hidden',
        aspectRatio: imageWidth && imageHeight ? `${imageWidth}/${imageHeight}` : '4/5',
        background: T.ink10,
        position: 'relative',
      }}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 390px) calc(100vw - 40px), 350px"
          style={{ objectFit: 'cover' }}
          priority
        />
        {hasGrooming && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            borderRadius: 999,
            background: T.terracotta,
            color: '#fff',
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: '0.08em',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="2.5" stroke="#fff" strokeWidth="1.6" />
              <circle cx="6" cy="18" r="2.5" stroke="#fff" strokeWidth="1.6" />
              <path d="M8.5 6l11 11M8.5 18L19.5 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            AFTER TRIMMING
          </div>
        )}
        {positionedItems.length === 1 ? (
          <ItemTagOverlay
            xPct={positionedItems[0].xPct}
            yPct={positionedItems[0].yPct}
            brand={positionedItems[0].brand}
            category={positionedItems[0].category}
            productName={positionedItems[0].productName}
          />
        ) : (
          positionedItems.map((item) => (
            <ItemTagOverlay
              key={item.id}
              xPct={item.xPct}
              yPct={item.yPct}
              brand={item.brand}
              category={item.category}
              productName={item.productName}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))
        )}
      </div>

      {/* 着用アイテム */}
      {items.length > 0 && (
        <div style={{
          margin: '0 20px',
          padding: '18px 16px 16px',
          borderRadius: 18,
          background: T.creamSoft,
          border: `1px solid ${T.hairline}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.ink50,
              fontWeight: 500,
            }}>
              着用アイテム · {items.length}
            </div>
          </div>

          {items.map((item, i) => {
            const color = itemColors[i % itemColors.length];
            const displayBrand = item.brand ?? categoryLabels[item.category] ?? item.category;
            const displayName = item.productName ?? categoryLabels[item.category] ?? item.category;
            const isPositioned = item.xPct != null && item.yPct != null;
            const isActive = openId === item.id;

            return (
              <div key={item.id}>
                {i > 0 && <div style={{ height: 1, background: T.hairline, margin: '12px 0' }} />}
                <div
                  onClick={isPositioned ? () => toggle(item.id) : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: isPositioned ? 'pointer' : 'default',
                    borderRadius: 10,
                    padding: '4px 0',
                    opacity: isPositioned && openId !== null && !isActive ? 0.5 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {/* プロダクトサムネイル */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    background: T.paper,
                    border: `1px solid ${isActive ? color : T.hairline}`,
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(45deg, ${T.ink10} 0, ${T.ink10} 4px, transparent 4px, transparent 8px)`,
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      background: color,
                    }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 9.5,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: T.ink50,
                      fontWeight: 600,
                    }}>
                      {displayBrand}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, marginTop: 2 }}>
                      {displayName}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 10.5, color: T.ink70, flexWrap: 'wrap' }}>
                      {item.size && <span>{item.size}</span>}
                      {item.size && item.fitNote && <span style={{ color: T.ink30 }}>·</span>}
                      {item.fitNote && <span style={{ color }}>{item.fitNote}</span>}
                    </div>
                  </div>

                  {item.priceJpy != null && (
                    <div style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 13,
                      fontWeight: 500,
                      color: T.ink,
                      letterSpacing: '-0.02em',
                      flexShrink: 0,
                    }}>
                      ¥{item.priceJpy.toLocaleString('ja-JP')}
                    </div>
                  )}
                </div>
                {item.purchaseUrl && (
                  <a
                    href={item.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: T.terracotta,
                      textDecoration: 'none',
                      marginTop: 6,
                      display: 'inline-block',
                      paddingLeft: 64,
                    }}
                  >
                    購入ページを見る →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
