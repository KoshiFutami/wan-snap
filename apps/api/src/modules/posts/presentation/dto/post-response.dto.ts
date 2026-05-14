import { Post } from '../../domain/entities/post.entity';
import { PostItem } from '../../domain/entities/post-item.entity';

export class PostItemResponseDto {
  id: string;
  category: string;
  brand: string | null;
  productName: string | null;
  size: string | null;
  purchaseUrl: string | null;
  priceJpy: number | null;
  fitNote: string | null;

  static from(this: void, item: PostItem): PostItemResponseDto {
    const dto = new PostItemResponseDto();
    dto.id = item.id.value;
    dto.category = item.category;
    dto.brand = item.brand;
    dto.productName = item.productName;
    dto.size = item.size;
    dto.purchaseUrl = item.purchaseUrl;
    dto.priceJpy = item.priceJpy;
    dto.fitNote = item.fitNote;
    return dto;
  }
}

export class PostResponseDto {
  id: string;
  authorId: string;
  dogId: string;
  imageUrl: string;
  caption: string | null;
  tags: string[];
  items: PostItemResponseDto[];
  createdAt: string;
  updatedAt: string;

  static from(this: void, post: Post): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = post.id.value;
    dto.authorId = post.authorId;
    dto.dogId = post.dogId;
    dto.imageUrl = post.imageUrl.value;
    dto.caption = post.caption?.value ?? null;
    dto.tags = post.tags.map((t) => t.value);
    dto.items = post.items.map(PostItemResponseDto.from);
    dto.createdAt = post.createdAt.toISOString();
    dto.updatedAt = post.updatedAt.toISOString();
    return dto;
  }
}

export class ListPostsResponseDto {
  posts: PostResponseDto[];
  nextCursor: string | null;
}
