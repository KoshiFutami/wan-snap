import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

type TagGroupRow = {
  tag: string;
  _count: {
    tag: number;
  };
};

class TagSummaryDto {
  tag: string;
  postCount: number;

  static from(this: void, row: TagGroupRow): TagSummaryDto {
    const dto = new TagSummaryDto();
    dto.tag = row.tag;
    dto.postCount = row._count.tag;
    return dto;
  }
}

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 30;

@Controller('tags')
export class TagsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('popular')
  async popular(@Query('limit') limit?: string): Promise<TagSummaryDto[]> {
    const rows = await this.prisma.postTag.groupBy({
      by: ['tag'],
      _count: { tag: true },
      orderBy: [{ _count: { tag: 'desc' } }, { tag: 'asc' }],
      take: this.parseLimit(limit),
    });

    return rows.map(TagSummaryDto.from);
  }

  @Get('search')
  async search(@Query('q') q?: string): Promise<TagSummaryDto[]> {
    const trimmed = q?.trim();
    if (!trimmed) {
      return [];
    }

    const rows = await this.prisma.postTag.groupBy({
      by: ['tag'],
      where: {
        tag: {
          contains: trimmed,
        },
      },
      _count: { tag: true },
      orderBy: [{ _count: { tag: 'desc' } }, { tag: 'asc' }],
      take: DEFAULT_LIMIT,
    });

    return rows.map(TagSummaryDto.from);
  }

  private parseLimit(limit?: string): number {
    const parsed = Number.parseInt(limit ?? '', 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return DEFAULT_LIMIT;
    }

    return Math.min(parsed, MAX_LIMIT);
  }
}
