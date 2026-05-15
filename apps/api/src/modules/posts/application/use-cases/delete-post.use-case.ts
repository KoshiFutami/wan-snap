import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IPostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY } from '../../domain/repositories/post.repository';
import { PostId } from '../../domain/value-objects/post-id.vo';
import { PostImageStorageService } from '../../infrastructure/services/post-image-storage.service';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepo: IPostRepository,
    private readonly postImageStorage: PostImageStorageService,
  ) {}

  async execute(id: string, requesterId: string): Promise<void> {
    const post = await this.postRepo.findById(PostId.of(id));
    if (!post) throw new NotFoundException('投稿が見つかりません');
    if (!post.isOwnedBy(requesterId)) {
      throw new ForbiddenException('この投稿を削除する権限がありません');
    }
    await this.postRepo.delete(post.id);
    await this.postImageStorage.deletePostImage(post.imageUrl.value);
  }
}
