import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PostItem } from '../../domain/entities/post-item.entity';
import { Caption } from '../../domain/value-objects/caption.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import { PostId } from '../../domain/value-objects/post-id.vo';
import { PostImageStorageService } from '../../infrastructure/services/post-image-storage.service';
import type { CreatePostItemInput } from './create-post.use-case';

export interface UpdatePostInput {
  id: string;
  requesterId: string;
  imageUrl?: string;
  caption?: string;
  items?: CreatePostItemInput[];
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
    const imageUrl =
      input.imageUrl !== undefined
        ? ImageUrl.of(input.imageUrl)
        : post.imageUrl;

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

    const updated = Post.reconstruct({
      ...post,
      imageUrl,
      caption,
      items,
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
