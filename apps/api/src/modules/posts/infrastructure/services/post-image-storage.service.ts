import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import {
  createPostImageObjectKey,
  extractS3ObjectKey,
  resolvePublicImageUrl,
} from './post-image-storage-url.util';

const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1600;
const WEBP_QUALITY = 85;

@Injectable()
export class PostImageStorageService {
  private readonly logger = new Logger(PostImageStorageService.name);
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

  async uploadPostImage(imageBuffer: Buffer): Promise<string> {
    if (!imageBuffer.length) {
      throw new BadRequestException('画像ファイルが空です');
    }

    const key = createPostImageObjectKey(new Date(), () => randomUUID());
    let optimizedImage: Buffer;
    try {
      optimizedImage = await sharp(imageBuffer)
        .rotate()
        .resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, {
          fit: 'inside',
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

  async deletePostImage(imageUrl: string): Promise<void> {
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
}
