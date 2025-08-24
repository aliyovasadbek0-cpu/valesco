import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/products.entity';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto, images?: { image?: string; image_middle?: string; image_bottom?: string }): Promise<Product> {
    // Validate unique articles in packing
    if (createProductDto.packing && createProductDto.packing.length > 0) {
      for (const item of createProductDto.packing) {
        if (!item.volume || !item.article) {
          console.log('Invalid packing item:', item); // Debugging uchun
          continue; // Noto'g'ri elementlarni o'tkazib yuboramiz
        }
        const existingProduct = await this.productsRepository
          .createQueryBuilder('product')
          .where('product.packing @> :article', { article: { article: item.article } })
          .getOne();
        if (existingProduct) {
          throw new BadRequestException(`Article ${item.article} already exists`);
        }
      }
    }

    const category = await this.categoriesService.findOne(createProductDto.categoryId);
    const product = this.productsRepository.create({
      title: {
        ru: createProductDto.title_ru,
        en: createProductDto.title_en,
      },
      description: {
        ru: createProductDto.description_ru,
        en: createProductDto.description_en,
      },
      packing: createProductDto.packing || [],
      advantages: {
        ru: createProductDto.advantages_ru || [],
        en: createProductDto.advantages_en || [],
      },
      specifications: {
        ru: createProductDto.specifications_ru || [],
        en: createProductDto.specifications_en || [],
      },
      characteristics: {
        ru: createProductDto.characteristics_ru || [],
        en: createProductDto.characteristics_en || [],
      },
      documentation: createProductDto.documentation || [],
      image: images?.image,
      image_middle: images?.image_middle,
      image_bottom: images?.image_bottom,
      line: createProductDto.line,
      viscosity: createProductDto.viscosity,
      category,
    });
    console.log('Product to save:', product); // Debugging uchun
    return this.productsRepository.save(product);
  }

  async findAll(filters: FilterProductsDto): Promise<Product[]> {
  const query = this.productsRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category');

  if (filters.categoryId) {
    query.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
  }

  if (filters.line) {
    query.andWhere('product.line = :line', { line: filters.line });
  }

  if (filters.viscosity) {
    query.andWhere('product.viscosity = :viscosity', { viscosity: filters.viscosity });
  }

  if (filters.approval) {
    query.andWhere('product.specifications::text ILIKE :approval', { approval: `%${filters.approval}%` });
  }

  return query.getMany();
}


  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, images?: { image?: string; image_middle?: string; image_bottom?: string }): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.title_ru || updateProductDto.title_en) {
      product.title = {
        ru: updateProductDto.title_ru || product.title.ru,
        en: updateProductDto.title_en || product.title.en,
      };
    }

    if (updateProductDto.description_ru || updateProductDto.description_en) {
      product.description = {
        ru: updateProductDto.description_ru || product.description?.ru,
        en: updateProductDto.description_en || product.description?.en,
      };
    }

    if (updateProductDto.packing) {
      for (const item of updateProductDto.packing) {
        if (!item.volume || !item.article) {
          console.log('Invalid packing item in update:', item); // Debugging uchun
          continue; // Noto'g'ri elementlarni o'tkazib yuboramiz
        }
        const existingProduct = await this.productsRepository
          .createQueryBuilder('product')
          .where('product.packing @> :article AND product.id != :id', { article: { article: item.article }, id })
          .getOne();
        if (existingProduct) {
          throw new BadRequestException(`Article ${item.article} already exists`);
        }
      }
      product.packing = updateProductDto.packing || [];
    }

    if (updateProductDto.advantages_ru || updateProductDto.advantages_en) {
      product.advantages = {
        ru: updateProductDto.advantages_ru || product.advantages?.ru || [],
        en: updateProductDto.advantages_en || product.advantages?.en || [],
      };
    }

    if (updateProductDto.specifications_ru || updateProductDto.specifications_en) {
      product.specifications = {
        ru: updateProductDto.specifications_ru || product.specifications?.ru || [],
        en: updateProductDto.specifications_en || product.specifications?.en || [],
      };
    }

    if (updateProductDto.characteristics_ru || updateProductDto.characteristics_en) {
      product.characteristics = {
        ru: updateProductDto.characteristics_ru || product.characteristics?.ru || [],
        en: updateProductDto.characteristics_en || product.characteristics?.en || [],
      };
    }

    if (updateProductDto.documentation) {
      product.documentation = updateProductDto.documentation;
    }

    if (images?.image) product.image = images.image;
    if (images?.image_middle) product.image_middle = images.image_middle;
    if (images?.image_bottom) product.image_bottom = images.image_bottom;
    if (updateProductDto.line) product.line = updateProductDto.line;
    if (updateProductDto.viscosity) product.viscosity = updateProductDto.viscosity;
    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(updateProductDto.categoryId);
      product.category = category;
    }

    console.log('Product to update:', product); // Debugging uchun
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async search(searchDto: SearchProductDto): Promise<Product[]> {
    if (!searchDto.query) {
      return this.findAll({});
    }
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.title ->> :lang1 LIKE :query OR product.title ->> :lang2 LIKE :query OR EXISTS (SELECT 1 FROM jsonb_array_elements(product.packing) AS p WHERE p->>\'article\' ILIKE :query)', {
        lang1: 'ru',
        lang2: 'en',
        query: `%${searchDto.query}%`,
      })
      .leftJoinAndSelect('product.category', 'category')
      .getMany();
  }
}