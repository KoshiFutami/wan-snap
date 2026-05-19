import {
  Prisma,
  Post as PrismaPost,
  PostGrooming as PrismaPostGrooming,
  PostItem as PrismaPostItem,
  PostTag as PrismaPostTag,
} from '@prisma/client';
import { Post } from '../../domain/entities/post.entity';
import { PostGrooming } from '../../domain/entities/post-grooming.entity';
import { PostItem } from '../../domain/entities/post-item.entity';
import { Caption } from '../../domain/value-objects/caption.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import { PostId } from '../../domain/value-objects/post-id.vo';
import { PostItemId } from '../../domain/value-objects/post-item-id.vo';
import { Tag } from '../../domain/value-objects/tag.vo';

type PrismaPostWithItems = PrismaPost & {
  items: PrismaPostItem[];
  postTags: Pick<PrismaPostTag, 'tag'>[];
  grooming: PrismaPostGrooming | null;
};

const toNum = (v: { toNumber(): number } | null) =>
  v != null ? v.toNumber() : null;

export class PostMapper {
  static toDomain(raw: PrismaPostWithItems): Post {
    const tags = raw.postTags.map(({ tag }) => Tag.of(tag));
    const items = raw.items.map((item) =>
      PostMapper.toItemDomain(item, raw.id),
    );

    const postId = PostId.of(raw.id);
    const grooming = raw.grooming
      ? PostGrooming.reconstruct({
          postId,
          salonName: raw.grooming.salonName,
          salonUrl: raw.grooming.salonUrl,
          salonInstagram: raw.grooming.salonInstagram,
          cutStyle: raw.grooming.cutStyle,
          note: raw.grooming.note,
        })
      : null;

    return Post.reconstruct({
      id: postId,
      authorId: raw.authorId,
      dogId: raw.dogId,
      imageUrl: ImageUrl.of(raw.imageUrl),
      imageWidth: raw.imageWidth,
      imageHeight: raw.imageHeight,
      caption: raw.caption ? Caption.of(raw.caption) : null,
      location: raw.location,
      tags,
      items,
      grooming,
      dogWeightKg: toNum(raw.dogWeightKg),
      dogNeckCm: toNum(raw.dogNeckCm),
      dogChestCm: toNum(raw.dogChestCm),
      dogBackLengthCm: toNum(raw.dogBackLengthCm),
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
    postTags: Prisma.PostTagUncheckedCreateInput[];
    grooming: Prisma.PostGroomingUncheckedCreateInput | null;
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
        location: post.location,
        dogWeightKg: post.dogWeightKg,
        dogNeckCm: post.dogNeckCm,
        dogChestCm: post.dogChestCm,
        dogBackLengthCm: post.dogBackLengthCm,
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
      postTags: post.tags.map((tag) => ({
        postId: post.id.value,
        tag: tag.value,
        createdAt: post.createdAt,
      })),
      grooming: post.grooming
        ? {
            postId: post.id.value,
            salonName: post.grooming.salonName,
            salonUrl: post.grooming.salonUrl,
            salonInstagram: post.grooming.salonInstagram,
            cutStyle: post.grooming.cutStyle,
            note: post.grooming.note,
          }
        : null,
    };
  }
}
