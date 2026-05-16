import { Inject, Injectable } from '@nestjs/common';
import {
  PUBLIC_DOG_REPOSITORY,
  type IPublicDogRepository,
  type PublicDogProfile,
} from '../../domain/repositories/public-dog.repository';

@Injectable()
export class GetPublicDogUseCase {
  constructor(
    @Inject(PUBLIC_DOG_REPOSITORY)
    private readonly publicDogRepository: IPublicDogRepository,
  ) {}

  async execute(id: string): Promise<PublicDogProfile | null> {
    return this.publicDogRepository.findById(id);
  }
}
