import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PostGrooming } from '../../domain/entities/post-grooming.entity';
import { PostItem } from '../../domain/entities/post-item.entity';
import { Caption } from '../../domain/value-objects/caption.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import { Tag } from '../../domain/value-objects/tag.vo';

export interface CreatePostItemInput {
  category: string;
  brand?: string;
  productName?: string;
  size?: string;
  purchaseUrl?: string;
  priceJpy?: number;
  fitNote?: string;
  xPct?: number;
  yPct?: number;
}

export interface CreatePostGroomingInput {
  salonName: string;
  salonInstagram?: string;
  cutStyle?: string;
  note?: string;
}

export interface CreatePostInput {
  authorId: string;
  dogId: string;
  imageUrl: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  caption?: string;
  location?: string | null;
  tags?: string[];
  items?: CreatePostItemInput[];
  grooming?: CreatePostGroomingInput;
}

interface DogBodySnapshot {
  weightKg: { toNumber(): number } | null;
  neckCm: { toNumber(): number } | null;
  chestCm: { toNumber(): number } | null;
  backLengthCm: { toNumber(): number } | null;
}

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: CreatePostInput): Promise<Post> {
    const dog = await this.verifyDogOwnership(input.dogId, input.authorId);

    const imageUrl = ImageUrl.of(input.imageUrl);
    const caption = input.caption ? Caption.of(input.caption) : undefined;
    const tags = [
      ...new Map(
        (input.tags ?? []).map((tag) => {
          const normalized = Tag.of(tag);
          return [normalized.value, normalized] as const;
        }),
      ).values(),
    ];

    const toNumber = (v: { toNumber(): number } | null) =>
      v != null ? v.toNumber() : null;

    const post = Post.create({
      authorId: input.authorId,
      dogId: input.dogId,
      imageUrl,
      imageWidth: input.imageWidth ?? null,
      imageHeight: input.imageHeight ?? null,
      caption,
      location: input.location ?? null,
      tags,
      dogWeightKg: toNumber(dog.weightKg),
      dogNeckCm: toNumber(dog.neckCm),
      dogChestCm: toNumber(dog.chestCm),
      dogBackLengthCm: toNumber(dog.backLengthCm),
    });

    const items = (input.items ?? []).map((item) =>
      PostItem.create({
        postId: post.id,
        category: item.category,
        brand: item.brand ?? null,
        productName: item.productName ?? null,
        size: item.size ?? null,
        purchaseUrl: item.purchaseUrl ?? null,
        priceJpy: item.priceJpy ?? null,
        fitNote: item.fitNote ?? null,
        xPct: item.xPct ?? null,
        yPct: item.yPct ?? null,
      }),
    );

    const grooming = input.grooming
      ? PostGrooming.create({
          postId: post.id,
          salonName: input.grooming.salonName,
          salonInstagram: input.grooming.salonInstagram ?? null,
          cutStyle: input.grooming.cutStyle ?? null,
          note: input.grooming.note ?? null,
        })
      : null;

    const postWithItems = Post.reconstruct({
      ...post,
      items,
      grooming,
    });

    await this.postRepo.save(postWithItems);
    return postWithItems;
  }

  private async verifyDogOwnership(
    dogId: string,
    userId: string,
  ): Promise<DogBodySnapshot> {
    const dog = await this.prisma.dog.findUnique({
      where: { id: dogId },
      select: {
        ownerId: true,
        weightKg: true,
        neckCm: true,
        chestCm: true,
        backLengthCm: true,
      },
    });
    if (!dog || dog.ownerId !== userId) {
      throw new ForbiddenException('指定された犬はあなたの所有ではありません');
    }
    return dog;
  }
}
