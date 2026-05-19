import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { IsValidBirthDateConstraint } from './validators/is-valid-birth-date.validator';

export class UpdateDogDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsUUID()
  breedId?: string;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  birthYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Validate(IsValidBirthDateConstraint)
  birthMonth?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  @Validate(IsValidBirthDateConstraint)
  birthDay?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(200)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  neckCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(300)
  chestCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  backLengthCm?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coatColors?: string[];

  @IsOptional()
  @IsUrl()
  photoUrl?: string | null;

  @IsOptional()
  @ValidateIf((o: UpdateDogDto) => o.gender !== null)
  @IsString()
  @IsIn(['male', 'female'])
  gender?: string | null;

  @IsOptional()
  @ValidateIf((o: UpdateDogDto) => o.bio !== null)
  @IsString()
  @MaxLength(500)
  bio?: string | null;

  @IsOptional()
  @ValidateIf((o: UpdateDogDto) => o.instagramUsername !== null)
  @IsString()
  @MaxLength(30)
  @Matches(/^(?!.*\.\.)(?!\.)[a-zA-Z0-9._]+(?<!\.)$/, {
    message:
      'Instagramユーザーネームは英数字・アンダースコア・ピリオドのみ使用可能で、先頭・末尾のピリオドと連続ピリオドは使用できません',
  })
  instagramUsername?: string | null;
}
