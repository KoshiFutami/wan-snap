import { v4 as uuidv4 } from 'uuid';

export class PostId {
  private constructor(readonly value: string) {}

  static generate(): PostId {
    return new PostId(uuidv4());
  }

  static of(value: string): PostId {
    if (!value) throw new Error('PostId cannot be empty');
    return new PostId(value);
  }

  equals(other: PostId): boolean {
    return this.value === other.value;
  }
}
