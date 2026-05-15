export interface ResolvePublicImageUrlInput {
  key: string;
  bucket: string;
  region: string;
  cdnUrl?: string;
  publicBaseUrl?: string;
  endpoint?: string;
}

export function createPostImageObjectKey(
  date: Date | undefined,
  uuidFactory: () => string,
): string {
  const baseDate = date ?? new Date();
  const year = baseDate.getUTCFullYear();
  const month = String(baseDate.getUTCMonth() + 1).padStart(2, '0');
  return `posts/${year}/${month}/${uuidFactory()}.webp`;
}

export function resolvePublicImageUrl({
  key,
  bucket,
  region,
  cdnUrl,
  publicBaseUrl,
  endpoint,
}: ResolvePublicImageUrlInput): string {
  if (cdnUrl) return `${trimTrailingSlash(cdnUrl)}/${key}`;
  if (publicBaseUrl) return `${trimTrailingSlash(publicBaseUrl)}/${key}`;
  if (endpoint) return `${trimTrailingSlash(endpoint)}/${bucket}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function extractS3ObjectKey(imageUrl: string): string | null {
  const match = imageUrl.match(/(posts\/\d{4}\/\d{2}\/[\w-]+\.webp)$/);
  return match?.[1] ?? null;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}
