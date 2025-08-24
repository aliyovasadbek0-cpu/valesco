// filter-products.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductsDto {
  @IsOptional()
  @Type(() => Number) // string query paramni number ga aylantiradi
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  line?: string; // e.g., 'Top', 'Zero', 'Racing'

  @IsOptional()
  @IsString()
  viscosity?: string; // e.g., '0W-20'

  @IsOptional()
  @IsString()
  approval?: string; // e.g., 'Mercedes-Benz'
}
