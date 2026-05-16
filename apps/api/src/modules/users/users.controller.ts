import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { imageFileInterceptor } from '../../common/interceptors/image-file.interceptor';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { UpdateUserDto } from './dto/update-user.dto';

const userSelect = {
  id: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  location: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileImageStorage: ProfileImageStorageService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: JwtPayload) {
    return this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    });
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(imageFileInterceptor)
  async uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: { buffer: Buffer },
  ) {
    if (!file) {
      throw new BadRequestException('画像ファイルを選択してください');
    }

    const current = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { avatarUrl: true },
    });
    if (!current) throw new NotFoundException('ユーザーが見つかりません');

    const avatarUrl = await this.profileImageStorage.uploadAvatar(
      user.sub,
      file.buffer,
    );

    const updated = await this.prisma.user.update({
      where: { id: user.sub },
      data: { avatarUrl },
      select: userSelect,
    });

    await this.profileImageStorage.deleteImage(current.avatarUrl);

    return { avatarUrl: updated.avatarUrl };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');
    return user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    const current = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { avatarUrl: true },
    });
    const updated = await this.prisma.user.update({
      where: { id: user.sub },
      data: dto,
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        updatedAt: true,
      },
    });
    if (
      dto.avatarUrl !== undefined &&
      current?.avatarUrl &&
      dto.avatarUrl !== current.avatarUrl
    ) {
      await this.profileImageStorage.deleteImage(current.avatarUrl);
    }
    return updated;
  }
}
