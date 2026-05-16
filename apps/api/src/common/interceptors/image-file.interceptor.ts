import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const imageFileInterceptor = FileInterceptor('file', {
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (_request, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(
        new BadRequestException('画像ファイルのみアップロードできます'),
        false,
      );
      return;
    }
    callback(null, true);
  },
});
