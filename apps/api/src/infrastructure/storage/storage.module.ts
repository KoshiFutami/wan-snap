import { Global, Module } from '@nestjs/common';
import { ProfileImageStorageService } from './profile-image-storage.service';

@Global()
@Module({
  providers: [ProfileImageStorageService],
  exports: [ProfileImageStorageService],
})
export class StorageModule {}
