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
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { imageFileInterceptor } from '../../common/interceptors/image-file.interceptor';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ProfileImageStorageService } from '../../infrastructure/storage/profile-image-storage.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

const dogWithBreedSelect = Prisma.validator<Prisma.DogSelect>()({
  id: true,
  name: true,
  breedId: true,
  birthYear: true,
  birthMonth: true,
  birthDay: true,
  weightKg: true,
  neckCm: true,
  chestCm: true,
  backLengthCm: true,
  coatColors: true,
  gender: true,
  bio: true,
  instagramUsername: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  breed: {
    select: {
      name: true,
      shortName: true,
    },
  },
});

type DogWithBreed = Prisma.DogGetPayload<{ select: typeof dogWithBreedSelect }>;

function toDogResponse(dog: DogWithBreed) {
  return {
    id: dog.id,
    name: dog.name,
    breedId: dog.breedId,
    breed: dog.breed.name,
    breedShortName: dog.breed.shortName,
    birthYear: dog.birthYear,
    birthMonth: dog.birthMonth,
    birthDay: dog.birthDay,
    weightKg: dog.weightKg ? dog.weightKg.toNumber() : null,
    neckCm: dog.neckCm ? dog.neckCm.toNumber() : null,
    chestCm: dog.chestCm ? dog.chestCm.toNumber() : null,
    backLengthCm: dog.backLengthCm ? dog.backLengthCm.toNumber() : null,
    coatColors: Array.isArray(dog.coatColors)
      ? dog.coatColors.filter(
          (color): color is string => typeof color === 'string',
        )
      : [],
    gender: dog.gender,
    bio: dog.bio,
    instagramUsername: dog.instagramUsername,
    photoUrl: dog.photoUrl,
    createdAt: dog.createdAt,
    updatedAt: dog.updatedAt,
  };
}

@Controller('dogs')
@UseGuards(JwtAuthGuard)
export class DogsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileImageStorage: ProfileImageStorageService,
  ) {}

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const dogs = await this.prisma.dog.findMany({
      where: { ownerId: user.sub },
      orderBy: { createdAt: 'asc' },
      select: dogWithBreedSelect,
    });

    return dogs.map(toDogResponse);
  }

  private async assertBreedExists(breedId: string) {
    const breed = await this.prisma.breed.findUnique({
      where: { id: breedId },
      select: { id: true },
    });
    if (!breed) {
      throw new BadRequestException('選択した犬種が見つかりません');
    }
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDogDto) {
    await this.assertBreedExists(dto.breedId);

    const dog = await this.prisma.dog.create({
      data: {
        ...dto,
        coatColors: dto.coatColors ?? [],
        ownerId: user.sub,
      },
      select: dogWithBreedSelect,
    });

    return toDogResponse(dog);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: dogWithBreedSelect,
    });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('閲覧権限がありません');
    return toDogResponse(dog);
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

    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
        photoUrl: true,
      },
    });
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
      select: {
        photoUrl: true,
      },
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
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
        photoUrl: true,
      },
    });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('編集権限がありません');

    if (dto.breedId) {
      await this.assertBreedExists(dto.breedId);
    }

    const updated = await this.prisma.dog.update({
      where: { id },
      data: dto,
      select: dogWithBreedSelect,
    });
    if (
      dto.photoUrl !== undefined &&
      dog.photoUrl &&
      dto.photoUrl !== dog.photoUrl
    ) {
      await this.profileImageStorage.deleteImage(dog.photoUrl);
    }
    return toDogResponse(updated);
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
