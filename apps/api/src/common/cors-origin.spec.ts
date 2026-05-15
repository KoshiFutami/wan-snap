import { resolveCorsOrigin } from './cors-origin';

describe('resolveCorsOrigin', () => {
  it('returns localhost in non-production when CORS_ORIGIN is missing', () => {
    expect(resolveCorsOrigin({ NODE_ENV: 'development' })).toBe(
      'http://localhost:3000',
    );
  });

  it('returns true in production when CORS_ORIGIN is missing', () => {
    expect(resolveCorsOrigin({ NODE_ENV: 'production' })).toBe(true);
  });

  it('returns a single configured origin', () => {
    expect(
      resolveCorsOrigin({ CORS_ORIGIN: 'https://wan-snap.example.com' }),
    ).toBe('https://wan-snap.example.com');
  });

  it('returns multiple configured origins', () => {
    expect(
      resolveCorsOrigin({
        CORS_ORIGIN:
          'https://wan-snap.example.com, https://wan-snap-preview.example.com',
      }),
    ).toEqual([
      'https://wan-snap.example.com',
      'https://wan-snap-preview.example.com',
    ]);
  });
});
