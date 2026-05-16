import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetPublicDogUseCase } from './application/use-cases/get-public-dog.use-case';

@Controller('dogs/public')
export class PublicDogsController {
  constructor(private readonly getPublicDog: GetPublicDogUseCase) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const dog = await this.getPublicDog.execute(id);
    if (!dog) throw new NotFoundException('犬プロフィールが見つかりません');
    return dog;
  }
}
