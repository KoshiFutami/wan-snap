import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 120,
          background: '#111827',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 300,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        W
      </div>
    ),
    { width: 512, height: 512 },
  );
}
