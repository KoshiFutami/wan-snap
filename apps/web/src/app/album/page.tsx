const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
};

export default function AlbumPage() {
  return (
    <div style={{ padding: '64px 12px', textAlign: 'center' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
        <path d="M6 4h12v17l-6-3.5L6 21V4z" stroke={T.ink10} strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <p
        style={{
          marginTop: 16,
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 20,
          fontWeight: 500,
          color: T.ink,
          letterSpacing: '-0.01em',
        }}
      >
        保存
      </p>
      <p style={{ marginTop: 8, fontSize: 13, color: T.ink50, lineHeight: 1.6 }}>
        保存したスナップを見る機能は<br />近日公開予定です。
      </p>
    </div>
  );
}
