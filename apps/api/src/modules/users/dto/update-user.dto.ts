import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Matches(/^(?!.*\.\.)(?!\.)[a-zA-Z0-9._]+(?<!\.)$/, {
    message:
      'ユーザーネームは英数字・アンダースコア・ピリオドのみ使用可能で、先頭・末尾のピリオドと連続ピリオドは使用できません',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @ValidateIf((o: UpdateUserDto) => o.instagramUsername !== null)
  @IsString()
  @MaxLength(30)
  @Matches(/^(?!.*\.\.)(?!\.)[a-zA-Z0-9._]+(?<!\.)$/, {
    message:
      'Instagramユーザーネームは英数字・アンダースコア・ピリオドのみ使用可能で、先頭・末尾のピリオドと連続ピリオドは使用できません',
  })
  instagramUsername?: string | null;
}
