const T = {
  ink: '#1F1A14',
};

export function WanSnapLogo({ size = 20 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={T.ink}>
        <ellipse cx="6" cy="9" rx="2" ry="2.6" />
        <ellipse cx="11" cy="6.4" rx="2" ry="2.6" />
        <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" />
        <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" />
        <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-serif, serif)',
          fontWeight: 600,
          fontSize: size * 0.9,
          letterSpacing: '-0.01em',
          color: T.ink,
        }}
      >
        Wan Snap
      </span>
    </div>
  );
}
