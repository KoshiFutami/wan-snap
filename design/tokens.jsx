// Design tokens for Wan-Snap
const WS_TOKENS = {
  // Warm naturals
  cream: '#F4EDE0',
  creamSoft: '#FAF5EA',
  paper: '#FFFEFB',
  // Ink
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  ink30: '#B8AE9E',
  ink10: '#E8E0D0',
  // Accents
  terracotta: '#B95A3D',
  terracottaSoft: '#E8C9B7',
  forest: '#3F5A40',
  forestSoft: '#C9D4C0',
  ochre: '#B88A3C',
  // System
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

// Type stacks
const WS_FONTS = {
  serif: '"Noto Serif JP", "Times New Roman", serif',
  sans: '"Zen Kaku Gothic New", -apple-system, "SF Pro Text", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

// Mock dog data — real Unsplash IDs
const WS_PHOTOS = {
  shibaPark: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=900&auto=format&fit=crop',
  shibaPort: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=900&auto=format&fit=crop',
  yorkie: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&auto=format&fit=crop',
  yorkieGrass: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=900&auto=format&fit=crop',
  corgi: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=900&auto=format&fit=crop',
  corgiBeach: 'https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=900&auto=format&fit=crop',
  poodle: 'https://images.unsplash.com/photo-1616606103915-dea7be788566?w=900&auto=format&fit=crop',
  dachshund: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=900&auto=format&fit=crop',
  golden: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=900&auto=format&fit=crop',
  goldenLeash: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&auto=format&fit=crop',
  frenchie: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&auto=format&fit=crop',
  jrt: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=900&auto=format&fit=crop',
  pomeranian: 'https://images.unsplash.com/photo-1583511666407-5f06533f2113?w=900&auto=format&fit=crop',
  malti: 'https://images.unsplash.com/photo-1616606103915-dea7be788566?w=900&auto=format&fit=crop',
};

Object.assign(window, { WS_TOKENS, WS_FONTS, WS_PHOTOS });
