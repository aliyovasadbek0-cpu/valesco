import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/products.entity';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { toPackingArray, toStringArray } from 'src/common/utils/parser.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto, images?: { image?: string[] }): Promise<Product> {
  // Packing article unique check
  if (createProductDto.packing && createProductDto.packing.length > 0) {
    for (const item of createProductDto.packing) {
      if (!item.volume || !item.article) continue;

      const existingProduct = await this.productsRepository
        .createQueryBuilder('product')
        .where('product.packing @> :article', { article: [{ article: item.article }] })
        .getOne();

      if (existingProduct) {
        throw new BadRequestException(`Article ${item.article} already exists`);
      }
    }
  }

  const category = await this.categoriesService.findOne(createProductDto.categoryId);

  const product = this.productsRepository.create({
    title: createProductDto.title,
    description_ru: createProductDto.description_ru?.trim() || '',
    description_en: createProductDto.description_en?.trim() || '',
    specifications: toStringArray(createProductDto.specifications),
    image: images?.image || [],
    sae: toStringArray(createProductDto.sae),
    density: toStringArray(createProductDto.density),
    kinematic_one: toStringArray(createProductDto.kinematic_one),
    kinematic_two: toStringArray(createProductDto.kinematic_two),
    viscosity: toStringArray(createProductDto.viscosity),
    flash: toStringArray(createProductDto.flash),
    temperature: toStringArray(createProductDto.temperature),
    base: toStringArray(createProductDto.base),
    info: toStringArray(createProductDto.info), 
    packing: toPackingArray(createProductDto.packing),
    category,
  });

  return this.productsRepository.save(product);
}

  async findAll(filters: FilterProductsDto): Promise<Product[]> {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters.categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
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

  async update(id: number, updateProductDto: UpdateProductDto, images?: { image?: string[] }): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.title) product.title = updateProductDto.title;
    if (updateProductDto.description_ru) product.description_ru = updateProductDto.description_ru;
    if (updateProductDto.description_en) product.description_en = updateProductDto.description_en;
    if (updateProductDto.specifications) product.specifications = updateProductDto.specifications;
    if (images?.image) product.image = images.image;
    if (updateProductDto.sae) product.sae = updateProductDto.sae;
    if (updateProductDto.density) product.density = updateProductDto.density;
    if (updateProductDto.kinematic_one) product.kinematic_one = updateProductDto.kinematic_one;
    if (updateProductDto.kinematic_two) product.kinematic_two = updateProductDto.kinematic_two;
    if (updateProductDto.viscosity) product.viscosity = updateProductDto.viscosity;
    if (updateProductDto.flash) product.flash = updateProductDto.flash;
    if (updateProductDto.temperature) product.temperature = updateProductDto.temperature;
    if (updateProductDto.base) product.base = updateProductDto.base;

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
      .where('product.title ILIKE :query OR EXISTS (SELECT 1 FROM jsonb_array_elements(product.packing) AS p WHERE p->>\'article\' ILIKE :query)', {
        query: `%${searchDto.query}%`,
      })
      .leftJoinAndSelect('product.category', 'category')
      .getMany();
  }
}