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
  imageWidth: number | null;
  imageHeight: number | null;
  caption: Caption | null;
  tags: Tag[];
  items: PostItem[];
  dogWeightKg: number | null;
  dogNeckCm: number | null;
  dogChestCm: number | null;
  dogBackLengthCm: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostProps {
  authorId: string;
  dogId: string;
  imageUrl: ImageUrl;
  imageWidth?: number | null;
  imageHeight?: number | null;
  caption?: Caption;
  tags?: Tag[];
  items?: PostItem[];
  dogWeightKg?: number | null;
  dogNeckCm?: number | null;
  dogChestCm?: number | null;
  dogBackLengthCm?: number | null;
}

export class Post {
  readonly id: PostId;
  readonly authorId: string;
  readonly dogId: string;
  readonly imageUrl: ImageUrl;
  readonly imageWidth: number | null;
  readonly imageHeight: number | null;
  readonly caption: Caption | null;
  readonly tags: Tag[];
  readonly items: PostItem[];
  readonly dogWeightKg: number | null;
  readonly dogNeckCm: number | null;
  readonly dogChestCm: number | null;
  readonly dogBackLengthCm: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: PostProps) {
    this.id = props.id;
    this.authorId = props.authorId;
    this.dogId = props.dogId;
    this.imageUrl = props.imageUrl;
    this.imageWidth = props.imageWidth;
    this.imageHeight = props.imageHeight;
    this.caption = props.caption;
    this.tags = props.tags;
    this.items = props.items;
    this.dogWeightKg = props.dogWeightKg;
    this.dogNeckCm = props.dogNeckCm;
    this.dogChestCm = props.dogChestCm;
    this.dogBackLengthCm = props.dogBackLengthCm;
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
      imageWidth: props.imageWidth ?? null,
      imageHeight: props.imageHeight ?? null,
      caption: props.caption ?? null,
      tags: props.tags ?? [],
      items: props.items ?? [],
      dogWeightKg: props.dogWeightKg ?? null,
      dogNeckCm: props.dogNeckCm ?? null,
      dogChestCm: props.dogChestCm ?? null,
      dogBackLengthCm: props.dogBackLengthCm ?? null,
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
