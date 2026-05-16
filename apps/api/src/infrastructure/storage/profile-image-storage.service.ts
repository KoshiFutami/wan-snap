import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import {
  createAvatarObjectKey,
  createDogPhotoObjectKey,
  extractS3ObjectKey,
  resolvePublicImageUrl,
} from './image-storage-url.util';

const MAX_PROFILE_SIZE = 512;
const WEBP_QUALITY = 85;

@Injectable()
export class ProfileImageStorageService {
  private readonly logger = new Logger(ProfileImageStorageService.name);
  private readonly bucket = process.env.STORAGE_BUCKET ?? 'wan-snap';
  private readonly region = process.env.STORAGE_REGION ?? 'ap-northeast-1';
  private readonly endpoint = process.env.STORAGE_ENDPOINT?.trim();
  private readonly cdnUrl = process.env.STORAGE_CDN_URL?.trim();
  private readonly publicBaseUrl = process.env.STORAGE_PUBLIC_BASE_URL?.trim();
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
      credentials:
        process.env.STORAGE_ACCESS_KEY && process.env.STORAGE_SECRET_KEY
          ? {
              accessKeyId: process.env.STORAGE_ACCESS_KEY,
              secretAccessKey: process.env.STORAGE_SECRET_KEY,
            }
          : undefined,
    });
  }

  async uploadAvatar(userId: string, imageBuffer: Buffer): Promise<string> {
    const key = createAvatarObjectKey(userId, () => randomUUID());
    return this.upload(key, imageBuffer);
  }

  async uploadDogPhoto(dogId: string, imageBuffer: Buffer): Promise<string> {
    const key = createDogPhotoObjectKey(dogId, () => randomUUID());
    return this.upload(key, imageBuffer);
  }

  async deleteImage(imageUrl: string | null | undefined): Promise<void> {
    if (!imageUrl) return;
    const key = extractS3ObjectKey(imageUrl);
    if (!key) return;
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      this.logger.error(`S3 オブジェクト削除失敗: ${key}`, error);
    }
  }

  private async upload(key: string, imageBuffer: Buffer): Promise<string> {
    if (!imageBuffer.length) {
      throw new BadRequestException('画像ファイルが空です');
    }

    let optimizedImage: Buffer;
    try {
      optimizedImage = await sharp(imageBuffer)
        .rotate()
        .resize(MAX_PROFILE_SIZE, MAX_PROFILE_SIZE, {
          fit: 'cover',
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
    } catch (error) {
      throw new BadRequestException('画像の変換に失敗しました', {
        cause: error,
      });
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: optimizedImage,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return resolvePublicImageUrl({
      key,
      bucket: this.bucket,
      region: this.region,
      cdnUrl: this.cdnUrl,
      publicBaseUrl: this.publicBaseUrl,
      endpoint: this.endpoint,
    });
  }
}
