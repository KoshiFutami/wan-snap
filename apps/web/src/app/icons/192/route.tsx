import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          borderRadius: 48,
          background: '#F4EDE0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="138" height="138" viewBox="0 0 24 24" fill="none">
          <ellipse cx="6" cy="9" rx="2" ry="2.6" fill="#1F1A14" />
          <ellipse cx="11" cy="6.4" rx="2" ry="2.6" fill="#1F1A14" />
          <ellipse cx="16.3" cy="7.6" rx="2" ry="2.6" fill="#1F1A14" />
          <ellipse cx="20" cy="11.5" rx="1.8" ry="2.3" fill="#1F1A14" />
          <path d="M12 11c-3.5 0-6.5 2.6-6.5 5.8 0 2 1.5 3.4 3.5 3.4 1.2 0 2.2-.6 3-.6s1.8.6 3 .6c2 0 3.5-1.4 3.5-3.4 0-3.2-3-5.8-6.5-5.8z" fill="#1F1A14" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 },
  );
}
