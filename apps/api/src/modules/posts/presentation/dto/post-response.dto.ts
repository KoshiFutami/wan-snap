import { Post } from '../../domain/entities/post.entity';
import { PostItem } from '../../domain/entities/post-item.entity';
import type { PostRelations } from '../../domain/repositories/post.repository';

export class PostItemResponseDto {
  id: string;
  category: string;
  brand: string | null;
  productName: string | null;
  size: string | null;
  purchaseUrl: string | null;
  priceJpy: number | null;
  fitNote: string | null;
  xPct: number | null;
  yPct: number | null;

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
    dto.xPct = item.xPct;
    dto.yPct = item.yPct;
    return dto;
  }
}

export class PostDogDto {
  name: string;
  breed: string;
  breedShortName: string;
  weightKg: number | null;
  photoUrl: string | null;
}

export class PostAuthorDto {
  displayName: string;
  username: string;
}

export class PostResponseDto {
  id: string;
  authorId: string;
  dogId: string;
  imageUrl: string;
  imageWidth: number | null;
  imageHeight: number | null;
  caption: string | null;
  location: string | null;
  tags: string[];
  items: PostItemResponseDto[];
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isBookmarkedByMe: boolean;
  createdAt: string;
  updatedAt: string;
  dog: PostDogDto | null;
  author: PostAuthorDto | null;

  static from(
    this: void,
    post: Post,
    relations?: PostRelations,
  ): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = post.id.value;
    dto.authorId = post.authorId;
    dto.dogId = post.dogId;
    dto.imageUrl = post.imageUrl.value;
    dto.imageWidth = post.imageWidth;
    dto.imageHeight = post.imageHeight;
    dto.caption = post.caption?.value ?? null;
    dto.location = post.location;
    dto.tags = post.tags.map((t) => t.value);
    dto.items = post.items.map(PostItemResponseDto.from);
    dto.likeCount = relations?.likeCount ?? 0;
    dto.bookmarkCount = relations?.bookmarkCount ?? 0;
    dto.commentCount = relations?.commentCount ?? 0;
    dto.isLikedByMe = relations?.isLikedByMe ?? false;
    dto.isBookmarkedByMe = relations?.isBookmarkedByMe ?? false;
    dto.createdAt = post.createdAt.toISOString();
    dto.updatedAt = post.updatedAt.toISOString();
    dto.dog = relations
      ? {
          name: relations.dogName,
          breed: relations.dogBreed,
          breedShortName: relations.dogBreedShortName,
          weightKg: relations.dogWeightKg,
          photoUrl: relations.dogPhotoUrl,
        }
      : null;
    dto.author = relations
      ? {
          displayName: relations.authorDisplayName,
          username: relations.authorUsername,
        }
      : null;
    return dto;
  }
}

export class ListPostsResponseDto {
  posts: PostResponseDto[];
  nextCursor: string | null;
}
