import {
  createAvatarObjectKey,
  createDogPhotoObjectKey,
  extractS3ObjectKey,
} from './image-storage-url.util';

describe('createAvatarObjectKey', () => {
  it('ユーザーIDとUUIDでキーを生成する', () => {
    const key = createAvatarObjectKey('user-1', () => 'abc');
    expect(key).toBe('avatars/user-1/abc.webp');
  });
});

describe('createDogPhotoObjectKey', () => {
  it('犬IDとUUIDでキーを生成する', () => {
    const key = createDogPhotoObjectKey('dog-1', () => 'abc');
    expect(key).toBe('dogs/dog-1/abc.webp');
  });
});

describe('extractS3ObjectKey (profile images)', () => {
  it('アバターURLからキーを抽出できる', () => {
    const key = extractS3ObjectKey(
      'http://localhost:9000/wan-snap/avatars/user-1/abc.webp',
    );
    expect(key).toBe('avatars/user-1/abc.webp');
  });

  it('犬写真URLからキーを抽出できる', () => {
    const key = extractS3ObjectKey(
      'https://cdn.example.com/dogs/dog-1/abc.webp',
    );
    expect(key).toBe('dogs/dog-1/abc.webp');
  });
});
