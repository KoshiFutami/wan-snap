export type ItemCategory =
  | 'tops'
  | 'bottoms'
  | 'dress'
  | 'outerwear'
  | 'collar'
  | 'harness'
  | 'leash'
  | 'bandana'
  | 'hat'
  | 'shoes'
  | 'other';

export type ItemSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'free' | 'custom';

export interface PostItem {
  id: string;
  postId: string;
  category: ItemCategory;
  brand?: string;
  productName?: string;
  size?: ItemSize;
  purchaseUrl?: string;
  priceJpy?: number;
  fitNote?: string;
  xPct?: number | null;
  yPct?: number | null;
}
