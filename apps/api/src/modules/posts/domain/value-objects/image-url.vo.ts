export class ImageUrl {
  private constructor(readonly value: string) {}

  static of(value: string): ImageUrl {
    if (!value) throw new Error('ImageUrl cannot be empty');
    if (!/^https?:\/\/.+/.test(value))
      throw new Error('ImageUrl must be a valid URL');
    return new ImageUrl(value);
  }
}
