import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import type {
  FindAllOptions,
  FindAllResult,
  FindAllWithRelationsResult,
  IPostRepository,
  PostRelations,
} from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PostId } from '../../domain/value-objects/post-id.vo';
import { PostMapper } from '../mappers/post.mapper';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: PostId): Promise<Post | null> {
    const raw = await this.prisma.post.findUnique({
      where: { id: id.value },
      include: { items: true },
    });
    return raw ? PostMapper.toDomain(raw) : null;
  }

  async findByIdWithRelations(
    id: PostId,
  ): Promise<{ post: Post; relations: PostRelations } | null> {
    const raw = await this.prisma.post.findUnique({
      where: { id: id.value },
      include: {
        items: true,
        dog: {
          select: { name: true, breed: true, weightKg: true, photoUrl: true },
        },
        author: { select: { displayName: true } },
      },
    });
    if (!raw) return null;
    return {
      post: PostMapper.toDomain(raw),
      relations: this.toRelations(raw),
    };
  }

  async findAllWithRelations(
    options: FindAllOptions = {},
  ): Promise<FindAllWithRelationsResult> {
    const limit = Math.min(options.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = options.cursor ? this.decodeCursor(options.cursor) : null;

    const raws = await this.prisma.post.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor.id }, skip: 1 }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        items: true,
        dog: {
          select: { name: true, breed: true, weightKg: true, photoUrl: true },
        },
        author: { select: { displayName: true } },
      },
    });

    const hasNext = raws.length > limit;
    const sliced = raws.slice(0, limit);
    const posts = sliced.map((r) => ({
      post: PostMapper.toDomain(r),
      relations: this.toRelations(r),
    }));
    const nextCursor =
      hasNext && posts.length > 0
        ? this.encodeCursor(posts[posts.length - 1].post)
        : null;

    return { posts, nextCursor };
  }

  private toRelations(raw: {
    dog: {
      name: string;
      breed: string;
      weightKg: { toNumber(): number } | null;
      photoUrl: string | null;
    };
    author: { displayName: string };
  }): PostRelations {
    return {
      dogName: raw.dog.name,
      dogBreed: raw.dog.breed,
      dogWeightKg: raw.dog.weightKg ? raw.dog.weightKg.toNumber() : null,
      dogPhotoUrl: raw.dog.photoUrl,
      authorDisplayName: raw.author.displayName,
    };
  }

  async findAll(options: FindAllOptions = {}): Promise<FindAllResult> {
    const limit = Math.min(options.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = options.cursor ? this.decodeCursor(options.cursor) : null;

    const raws = await this.prisma.post.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor.id },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { items: true },
    });

    const hasNext = raws.length > limit;
    const posts = raws.slice(0, limit).map((r) => PostMapper.toDomain(r));
    const nextCursor =
      hasNext && posts.length > 0
        ? this.encodeCursor(posts[posts.length - 1])
        : null;

    return { posts, nextCursor };
  }

  async save(post: Post): Promise<void> {
    const { postId, postData, items } = PostMapper.toPersistence(post);

    await this.prisma.$transaction(async (tx) => {
      await tx.post.upsert({
        where: { id: postId },
        create: postData,
        update: postData,
      });

      await tx.postItem.deleteMany({ where: { postId } });
      if (items.length > 0) {
        await tx.postItem.createMany({ data: items });
      }
    });
  }

  async delete(id: PostId): Promise<void> {
    await this.prisma.post.delete({ where: { id: id.value } });
  }

  private encodeCursor(post: Post): string {
    return Buffer.from(
      JSON.stringify({
        createdAt: post.createdAt.toISOString(),
        id: post.id.value,
      }),
    ).toString('base64url');
  }

  private decodeCursor(cursor: string): { createdAt: string; id: string } {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8')) as {
      createdAt: string;
      id: string;
    };
  }
}
