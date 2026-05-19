import { resolveCorsOrigin } from './cors-origin';

describe('resolveCorsOrigin', () => {
  it('returns localhost in non-production when CORS_ORIGIN is missing', () => {
    expect(resolveCorsOrigin({ NODE_ENV: 'development' })).toBe(
      'http://localhost:3000',
    );
  });

  it('returns a resolver in production when CORS_ORIGIN is missing', () => {
    const originResolver = resolveCorsOrigin({ NODE_ENV: 'production' });
    expect(typeof originResolver).toBe('function');

    const callback = jest.fn();
    if (typeof originResolver !== 'function') {
      throw new Error('originResolver should be a function');
    }

    originResolver('https://wan-snap.vercel.app', callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('rejects non-vercel origins in production when CORS_ORIGIN is missing', () => {
    const originResolver = resolveCorsOrigin({ NODE_ENV: 'production' });
    expect(typeof originResolver).toBe('function');

    const callback = jest.fn();
    if (typeof originResolver !== 'function') {
      throw new Error('originResolver should be a function');
    }

    originResolver('https://example.com', callback);
    expect(callback).toHaveBeenCalledWith(null, false);
  });

  it('allows vercel preview origins even when CORS_ORIGIN is configured in production', () => {
    const originResolver = resolveCorsOrigin({
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://www.wan-snap.com',
    });
    expect(typeof originResolver).toBe('function');

    const callback = jest.fn();
    if (typeof originResolver !== 'function') {
      throw new Error('originResolver should be a function');
    }

    originResolver('https://wan-snap-preview.vercel.app', callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('allows configured origins in production even with CORS_ORIGIN set', () => {
    const originResolver = resolveCorsOrigin({
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://www.wan-snap.com',
    });
    expect(typeof originResolver).toBe('function');

    const callback = jest.fn();
    if (typeof originResolver !== 'function') {
      throw new Error('originResolver should be a function');
    }

    originResolver('https://www.wan-snap.com', callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('rejects unknown origins in production when CORS_ORIGIN is configured', () => {
    const originResolver = resolveCorsOrigin({
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://www.wan-snap.com',
    });
    expect(typeof originResolver).toBe('function');

    const callback = jest.fn();
    if (typeof originResolver !== 'function') {
      throw new Error('originResolver should be a function');
    }

    originResolver('https://example.com', callback);
    expect(callback).toHaveBeenCalledWith(null, false);
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

  it('ignores blank origins in CORS_ORIGIN', () => {
    expect(
      resolveCorsOrigin({ CORS_ORIGIN: ' , https://wan-snap.example.com, ' }),
    ).toBe('https://wan-snap.example.com');
  });

  it('falls back to localhost when CORS_ORIGIN has only blanks', () => {
    expect(
      resolveCorsOrigin({ NODE_ENV: 'development', CORS_ORIGIN: ' , ' }),
    ).toBe('http://localhost:3000');
  });
});
