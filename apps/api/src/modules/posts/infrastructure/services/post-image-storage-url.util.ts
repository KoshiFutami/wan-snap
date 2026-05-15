export interface ResolvePublicImageUrlInput {
  key: string;
  bucket: string;
  region: string;
  cdnUrl?: string;
  publicBaseUrl?: string;
  endpoint?: string;
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

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}
