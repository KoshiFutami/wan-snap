import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
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
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Controller('dogs')
@UseGuards(JwtAuthGuard)
export class DogsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileImageStorage: ProfileImageStorageService,
  ) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.prisma.dog.findMany({
      where: { ownerId: user.sub },
      orderBy: { createdAt: 'asc' },
    });
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDogDto) {
    await this.prisma.breed.upsert({
      where: { name: dto.breed },
      update: {},
      create: { name: dto.breed },
    });
    return this.prisma.dog.create({
      data: {
        ...dto,
        coatColors: dto.coatColors ?? [],
        ownerId: user.sub,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const dog = await this.prisma.dog.findUnique({ where: { id } });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('閲覧権限がありません');
    return dog;
  }

  @Post(':id/photo')
  @UseInterceptors(imageFileInterceptor)
  async uploadPhoto(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: { buffer: Buffer },
  ) {
    if (!file) {
      throw new BadRequestException('画像ファイルを選択してください');
    }

    const dog = await this.prisma.dog.findUnique({ where: { id } });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('編集権限がありません');

    const photoUrl = await this.profileImageStorage.uploadDogPhoto(
      id,
      file.buffer,
    );

    const updated = await this.prisma.dog.update({
      where: { id },
      data: { photoUrl },
    });

    await this.profileImageStorage.deleteImage(dog.photoUrl);

    return { photoUrl: updated.photoUrl };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateDogDto,
  ) {
    const dog = await this.prisma.dog.findUnique({ where: { id } });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('編集権限がありません');

    const updated = await this.prisma.dog.update({ where: { id }, data: dto });
    if (
      dto.photoUrl !== undefined &&
      dog.photoUrl &&
      dto.photoUrl !== dog.photoUrl
    ) {
      await this.profileImageStorage.deleteImage(dog.photoUrl);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const dog = await this.prisma.dog.findUnique({ where: { id } });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('削除権限がありません');
    await this.prisma.dog.delete({ where: { id } });
    await this.profileImageStorage.deleteImage(dog.photoUrl);
  }
}
