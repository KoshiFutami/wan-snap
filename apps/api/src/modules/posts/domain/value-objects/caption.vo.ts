const MAX_LENGTH = 1000;

export class Caption {
  private constructor(readonly value: string) {}

  static of(value: string): Caption {
    if (value.length > MAX_LENGTH) {
      throw new Error(`Caption must be ${MAX_LENGTH} characters or less`);
    }
    return new Caption(value);
  }
}
