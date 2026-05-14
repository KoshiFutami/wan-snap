export class Tag {
  private constructor(readonly value: string) {}

  static of(value: string): Tag {
    if (!value.trim()) throw new Error('Tag cannot be empty');
    if (value.length > 50) throw new Error('Tag must be 50 characters or less');
    return new Tag(value.trim());
  }
}
