import { v4 as uuidv4 } from 'uuid';

export class PostItemId {
  private constructor(readonly value: string) {}

  static generate(): PostItemId {
    return new PostItemId(uuidv4());
  }

  static of(value: string): PostItemId {
    if (!value) throw new Error('PostItemId cannot be empty');
    return new PostItemId(value);
  }
}
