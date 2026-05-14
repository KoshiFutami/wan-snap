import { Caption } from '../value-objects/caption.vo';
import { ImageUrl } from '../value-objects/image-url.vo';
import { PostId } from '../value-objects/post-id.vo';
import { Tag } from '../value-objects/tag.vo';
import { PostItem } from './post-item.entity';

export interface PostProps {
  id: PostId;
  authorId: string;
  dogId: string;
  imageUrl: ImageUrl;
  caption: Caption | null;
  tags: Tag[];
  items: PostItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostProps {
  authorId: string;
  dogId: string;
  imageUrl: ImageUrl;
  caption?: Caption;
  tags?: Tag[];
  items?: PostItem[];
}

export class Post {
  readonly id: PostId;
  readonly authorId: string;
  readonly dogId: string;
  readonly imageUrl: ImageUrl;
  readonly caption: Caption | null;
  readonly tags: Tag[];
  readonly items: PostItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: PostProps) {
    this.id = props.id;
    this.authorId = props.authorId;
    this.dogId = props.dogId;
    this.imageUrl = props.imageUrl;
    this.caption = props.caption;
    this.tags = props.tags;
    this.items = props.items;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: CreatePostProps): Post {
    const now = new Date();
    return new Post({
      id: PostId.generate(),
      authorId: props.authorId,
      dogId: props.dogId,
      imageUrl: props.imageUrl,
      caption: props.caption ?? null,
      tags: props.tags ?? [],
      items: props.items ?? [],
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(props: PostProps): Post {
    return new Post(props);
  }

  isOwnedBy(userId: string): boolean {
    return this.authorId === userId;
  }
}
