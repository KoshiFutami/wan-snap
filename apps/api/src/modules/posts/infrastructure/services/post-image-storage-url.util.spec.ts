import { resolvePublicImageUrl } from './post-image-storage-url.util';

describe('resolvePublicImageUrl', () => {
  it('CloudFront URL がある場合は CloudFront を優先する', () => {
    const url = resolvePublicImageUrl({
      key: 'posts/2026/05/test.webp',
      bucket: 'wan-snap',
      region: 'ap-northeast-1',
      cdnUrl: 'https://d111111abcdef8.cloudfront.net/',
      publicBaseUrl: 'http://localhost:9000/wan-snap',
      endpoint: 'http://minio:9000',
    });

    expect(url).toBe(
      'https://d111111abcdef8.cloudfront.net/posts/2026/05/test.webp',
    );
  });

  it('公開URLがある場合は endpoint より公開URLを使う', () => {
    const url = resolvePublicImageUrl({
      key: 'posts/2026/05/test.webp',
      bucket: 'wan-snap',
      region: 'ap-northeast-1',
      publicBaseUrl: 'http://localhost:9000/wan-snap/',
      endpoint: 'http://minio:9000',
    });

    expect(url).toBe('http://localhost:9000/wan-snap/posts/2026/05/test.webp');
  });

  it('どれも設定がない場合は S3 直URLを返す', () => {
    const url = resolvePublicImageUrl({
      key: 'posts/2026/05/test.webp',
      bucket: 'wan-snap',
      region: 'ap-northeast-1',
    });

    expect(url).toBe(
      'https://wan-snap.s3.ap-northeast-1.amazonaws.com/posts/2026/05/test.webp',
    );
  });
});
