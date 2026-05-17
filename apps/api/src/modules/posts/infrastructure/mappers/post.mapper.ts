import {
  Prisma,
  Post as PrismaPost,
  PostItem as PrismaPostItem,
} from '@prisma/client';
import { Post } from '../../domain/entities/post.entity';
import { PostItem } from '../../domain/entities/post-item.entity';
import { Caption } from '../../domain/value-objects/caption.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import { PostId } from '../../domain/value-objects/post-id.vo';
import { PostItemId } from '../../domain/value-objects/post-item-id.vo';
import { Tag } from '../../domain/value-objects/tag.vo';

type PrismaPostWithItems = PrismaPost & { items: PrismaPostItem[] };

export class PostMapper {
  static toDomain(raw: PrismaPostWithItems): Post {
    const tags = (raw.tags as string[]).map((t) => Tag.of(t));
    const items = raw.items.map((item) =>
      PostMapper.toItemDomain(item, raw.id),
    );

    return Post.reconstruct({
      id: PostId.of(raw.id),
      authorId: raw.authorId,
      dogId: raw.dogId,
      imageUrl: ImageUrl.of(raw.imageUrl),
      imageWidth: raw.imageWidth,
      imageHeight: raw.imageHeight,
      caption: raw.caption ? Caption.of(raw.caption) : null,
      tags,
      items,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private static toItemDomain(raw: PrismaPostItem, postId: string): PostItem {
    return PostItem.reconstruct({
      id: PostItemId.of(raw.id),
      postId: PostId.of(postId),
      category: raw.category,
      brand: raw.brand,
      productName: raw.productName,
      size: raw.size,
      purchaseUrl: raw.purchaseUrl,
      priceJpy: raw.priceJpy,
      fitNote: raw.fitNote,
      xPct: raw.xPct,
      yPct: raw.yPct,
    });
  }

  static toPersistence(post: Post): {
    postId: string;
    postData: Prisma.PostUncheckedCreateInput;
    items: Prisma.PostItemUncheckedCreateInput[];
  } {
    return {
      postId: post.id.value,
      postData: {
        id: post.id.value,
        authorId: post.authorId,
        dogId: post.dogId,
        imageUrl: post.imageUrl.value,
        imageWidth: post.imageWidth,
        imageHeight: post.imageHeight,
        caption: post.caption?.value ?? null,
        tags: post.tags.map((t) => t.value),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      items: post.items.map((item) => ({
        id: item.id.value,
        postId: post.id.value,
        category: item.category,
        brand: item.brand,
        productName: item.productName,
        size: item.size,
        purchaseUrl: item.purchaseUrl,
        priceJpy: item.priceJpy,
        fitNote: item.fitNote,
        xPct: item.xPct,
        yPct: item.yPct,
      })),
    };
  }
}
