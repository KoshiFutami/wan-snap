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

const dogSelect = Prisma.validator<Prisma.DogSelect>()({
  id: true,
  name: true,
  breed: true,
  birthYear: true,
  weightKg: true,
  neckCm: true,
  chestCm: true,
  backLengthCm: true,
  coatColors: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

type DogRecord = Prisma.DogGetPayload<{ select: typeof dogSelect }>;

@Controller('dogs')
@UseGuards(JwtAuthGuard)
export class DogsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileImageStorage: ProfileImageStorageService,
  ) {}

  private async getBreedShortNameMap(breeds: string[]) {
    const uniqueBreeds = [...new Set(breeds.filter(Boolean))];
    if (uniqueBreeds.length === 0) {
      return new Map<string, string>();
    }

    const records = await this.prisma.breed.findMany({
      where: { name: { in: uniqueBreeds } },
      select: { name: true, shortName: true },
    });

    return new Map(records.map((breed) => [breed.name, breed.shortName]));
  }

  private toDogResponse(
    dog: DogRecord,
    breedShortNameMap: Map<string, string>,
  ) {
    return {
      id: dog.id,
      name: dog.name,
      breed: dog.breed,
      breedShortName: breedShortNameMap.get(dog.breed) ?? dog.breed,
      birthYear: dog.birthYear,
      weightKg: dog.weightKg ? dog.weightKg.toNumber() : null,
      neckCm: dog.neckCm ? dog.neckCm.toNumber() : null,
      chestCm: dog.chestCm ? dog.chestCm.toNumber() : null,
      backLengthCm: dog.backLengthCm ? dog.backLengthCm.toNumber() : null,
      coatColors: Array.isArray(dog.coatColors)
        ? dog.coatColors.filter(
            (color): color is string => typeof color === 'string',
          )
        : [],
      photoUrl: dog.photoUrl,
      createdAt: dog.createdAt,
      updatedAt: dog.updatedAt,
    };
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const dogs = await this.prisma.dog.findMany({
      where: { ownerId: user.sub },
      orderBy: { createdAt: 'asc' },
      select: dogSelect,
    });
    const breedShortNameMap = await this.getBreedShortNameMap(
      dogs.map((dog) => dog.breed),
    );
    return dogs.map((dog) => this.toDogResponse(dog, breedShortNameMap));
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDogDto) {
    await this.prisma.breed.upsert({
      where: { name: dto.breed },
      update: {},
      create: { name: dto.breed, shortName: dto.breed },
    });
    const dog = await this.prisma.dog.create({
      data: {
        ...dto,
        coatColors: dto.coatColors ?? [],
        ownerId: user.sub,
      },
      select: dogSelect,
    });
    const breedShortNameMap = await this.getBreedShortNameMap([dog.breed]);
    return this.toDogResponse(dog, breedShortNameMap);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: dogSelect,
    });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('閲覧権限がありません');
    const breedShortNameMap = await this.getBreedShortNameMap([dog.breed]);
    return this.toDogResponse(dog, breedShortNameMap);
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
    const dog = await this.prisma.dog.findUnique({
      where: { id },
      select: dogSelect,
    });
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    if (dog.ownerId !== user.sub)
      throw new ForbiddenException('編集権限がありません');

    const updated = await this.prisma.dog.update({
      where: { id },
      data: dto,
      select: dogSelect,
    });
    if (
      dto.photoUrl !== undefined &&
      dog.photoUrl &&
      dto.photoUrl !== dog.photoUrl
    ) {
      await this.profileImageStorage.deleteImage(dog.photoUrl);
    }
    const breedShortNameMap = await this.getBreedShortNameMap([updated.breed]);
    return this.toDogResponse(updated, breedShortNameMap);
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
