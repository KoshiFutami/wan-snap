'use client';

import { useState } from 'react';
import { ItemTagOverlay } from './photo-tag-canvas';

type Item = {
  id: string;
  xPct: number;
  yPct: number;
  brand: string | null;
  category: string;
  productName: string | null;
};

export function TappableTagOverlays({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      {items.map((item) => (
        <ItemTagOverlay
          key={item.id}
          xPct={item.xPct}
          yPct={item.yPct}
          brand={item.brand}
          category={item.category}
          productName={item.productName}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </>
  );
}
