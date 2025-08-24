import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title_ru: string;

  @IsString()
  title_en: string;

  @IsOptional()
  @IsString()
  img?: string;
}