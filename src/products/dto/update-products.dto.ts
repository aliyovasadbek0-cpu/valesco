import { IsString, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toStringArray, toPackingArray } from 'src/common/utils/parser.util';

export class PackingDto {
  @IsString()
  volume: string;

  @IsString()
  article: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  description_ru?: string;

  @IsOptional()
  @IsString()
  description_en?: string;

  @IsOptional()
  @Transform(({ value }) => toPackingArray(value))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackingDto)
  packing?: PackingDto[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  advantages_ru?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  advantages_en?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  specifications_ru?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  specifications_en?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  characteristics_ru?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  characteristics_en?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  documentation?: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  image_middle?: string;

  @IsOptional()
  @IsString()
  image_bottom?: string;

  @IsOptional()
  @IsString()
  line?: string;

  @IsOptional()
  @IsString()
  viscosity?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;
}
