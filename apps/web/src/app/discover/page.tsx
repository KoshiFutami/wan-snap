const T = {
  ink: '#1F1A14',
  ink50: '#7E7567',
  ink10: '#E8E0D0',
};

export default function DiscoverPage() {
  return (
    <div style={{ padding: '64px 12px', textAlign: 'center' }}>
      <svg width="48" height="48" viewBox="0 0 20 20" fill="none" style={{ margin: '0 auto' }}>
        <circle cx="9" cy="9" r="6" stroke={T.ink10} strokeWidth="2" />
        <path d="M13.5 13.5L17 17" stroke={T.ink10} strokeWidth="2" strokeLinecap="round" />
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
        さがす
      </p>
      <p style={{ marginTop: 8, fontSize: 13, color: T.ink50, lineHeight: 1.6 }}>
        犬種・サイズで絞り込む検索機能は<br />近日公開予定です。
      </p>
    </div>
  );
}
