import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  line?: string;

  @IsOptional()
  @IsString()
  viscosity?: string;

  @IsOptional()
  @IsString()
  approval?: string;
}