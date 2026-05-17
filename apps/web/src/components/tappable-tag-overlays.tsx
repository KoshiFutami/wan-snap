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
  const [openId, setOpenId] = useState<string | null>(
    items.length > 1 ? items[0].id : null,
  );

  if (items.length === 1) {
    const item = items[0];
    return (
      <ItemTagOverlay
        xPct={item.xPct}
        yPct={item.yPct}
        brand={item.brand}
        category={item.category}
        productName={item.productName}
      />
    );
  }

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
