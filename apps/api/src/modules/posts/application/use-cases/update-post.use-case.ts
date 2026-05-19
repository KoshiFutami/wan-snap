import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PostGrooming } from '../../domain/entities/post-grooming.entity';
import { PostItem } from '../../domain/entities/post-item.entity';
import { Caption } from '../../domain/value-objects/caption.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import { PostId } from '../../domain/value-objects/post-id.vo';
import { Tag } from '../../domain/value-objects/tag.vo';
import { PostImageStorageService } from '../../infrastructure/services/post-image-storage.service';
import type {
  CreatePostGroomingInput,
  CreatePostItemInput,
} from './create-post.use-case';

export interface UpdatePostInput {
  id: string;
  requesterId: string;
  imageUrl?: string;
  caption?: string;
  location?: string | null;
  tags?: string[];
  items?: CreatePostItemInput[];
  // null を渡すとトリミング情報を削除する
  grooming?: CreatePostGroomingInput | null;
}

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
    private readonly postImageStorage: PostImageStorageService,
  ) {}

  async execute(input: UpdatePostInput): Promise<Post> {
    const post = await this.postRepo.findById(PostId.of(input.id));
    if (!post) throw new NotFoundException('投稿が見つかりません');
    if (!post.isOwnedBy(input.requesterId)) {
      throw new ForbiddenException('この投稿を編集する権限がありません');
    }

    const caption =
      input.caption !== undefined
        ? input.caption.trim()
          ? Caption.of(input.caption)
          : null
        : post.caption;
    const location =
      input.location !== undefined
        ? input.location?.trim() || null
        : post.location;
    const imageUrl =
      input.imageUrl !== undefined
        ? ImageUrl.of(input.imageUrl)
        : post.imageUrl;
    const tags =
      input.tags !== undefined
        ? [
            ...new Map(
              input.tags.map((tag) => {
                const normalized = Tag.of(tag);
                return [normalized.value, normalized] as const;
              }),
            ).values(),
          ]
        : post.tags;

    const items =
      input.items !== undefined
        ? input.items.map((item) =>
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
          )
        : post.items;

    const grooming =
      input.grooming !== undefined
        ? input.grooming
          ? PostGrooming.create({
              postId: post.id,
              salonName: input.grooming.salonName,
              salonUrl: input.grooming.salonUrl ?? null,
              salonInstagram: input.grooming.salonInstagram ?? null,
              cutStyle: input.grooming.cutStyle ?? null,
              note: input.grooming.note ?? null,
            })
          : null
        : post.grooming;

    const updated = Post.reconstruct({
      ...post,
      imageUrl,
      caption,
      location,
      tags,
      items,
      grooming,
      updatedAt: new Date(),
    });

    await this.postRepo.save(updated);
    if (
      input.imageUrl !== undefined &&
      input.imageUrl !== post.imageUrl.value
    ) {
      await this.postImageStorage.deleteImage(post.imageUrl.value);
    }
    return updated;
  }
}
