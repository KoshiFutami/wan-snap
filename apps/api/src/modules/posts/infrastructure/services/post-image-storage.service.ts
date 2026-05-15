import { BadRequestException, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { resolvePublicImageUrl } from './post-image-storage-url.util';

const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1600;
const WEBP_QUALITY = 85;

@Injectable()
export class PostImageStorageService {
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
      forcePathStyle:
        process.env.STORAGE_FORCE_PATH_STYLE === 'true' ||
        Boolean(this.endpoint),
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

    const key = this.createObjectKey();
    const optimizedImage = await sharp(imageBuffer)
      .rotate()
      .resize(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

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

  private createObjectKey(): string {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `posts/${year}/${month}/${randomUUID()}.webp`;
  }
}
