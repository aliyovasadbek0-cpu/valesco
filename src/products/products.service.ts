import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, QueryFailedError } from 'typeorm';
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

  async create(createProductDto: CreateProductDto, images?: { image?: string[] }): Promise<Product> {
    return await this.productsRepository.manager.transaction(async (transactionalEntityManager) => {
      // Validate category
      const category = await this.categoriesService.findOne(createProductDto.categoryId);
      if (!category) {
        throw new BadRequestException(`Category with ID ${createProductDto.categoryId} does not exist`);
      }

      // Validate packing
      if (createProductDto.packing && createProductDto.packing.length > 0) {
        const articles = createProductDto.packing.map((item) => item.article);
        const duplicateArticles = articles.filter((item, index) => articles.indexOf(item) !== index);
        if (duplicateArticles.length > 0) {
          throw new BadRequestException(`Duplicate articles found in packing: ${duplicateArticles.join(', ')}`);
        }

        for (const item of createProductDto.packing) {
          if (!item.volume || !item.article) {
            throw new BadRequestException('Invalid packing item: volume and article are required');
          }
          const existingProduct = await transactionalEntityManager
            .createQueryBuilder(Product, 'product')
            .where('product.packing @> :article', { article: [{ article: item.article }] })
            .getOne();
          if (existingProduct) {
            throw new BadRequestException(`Article ${item.article} already exists in another product`);
          }
        }
      }

      const product = transactionalEntityManager.create(Product, {
        title: createProductDto.title,
        description_ru: createProductDto.description_ru || '',
        description_en: createProductDto.description_en || '',
        specifications: createProductDto.specifications || [],
        image: images?.image || [],
        sae: createProductDto.sae || [],
        density: createProductDto.density || [],
        kinematic_one: createProductDto.kinematic_one || [],
        kinematic_two: createProductDto.kinematic_two || [],
        viscosity: createProductDto.viscosity || [],
        flash: createProductDto.flash || [],
        temperature: createProductDto.temperature || [],
        base: createProductDto.base || [],
        info: createProductDto.info || [],
        packing: createProductDto.packing || [],
        category,
      });

      try {
        const savedProduct = await transactionalEntityManager.save(Product, product);
        // Faqat yaratilgan mahsulotni qaytarish
        const result = await transactionalEntityManager.findOne(Product, {
          where: { id: savedProduct.id },
          relations: ['category'],
        });
        if (!result) {
          throw new NotFoundException(`Failed to retrieve created product with ID ${savedProduct.id}`);
        }
        return result;
      } catch (error) {
        if (error instanceof QueryFailedError && error.message.includes('invalid input syntax for type json')) {
          throw new BadRequestException('Invalid JSON format in packing field');
        }
        throw error;
      }
    });
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
    return await this.productsRepository.manager.transaction(async (transactionalEntityManager) => {
      const product = await this.findOne(id);

      if (updateProductDto.title) product.title = updateProductDto.title;
      if (updateProductDto.description_ru !== undefined) product.description_ru = updateProductDto.description_ru || '';
      if (updateProductDto.description_en !== undefined) product.description_en = updateProductDto.description_en || '';
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
      if (updateProductDto.info) product.info = updateProductDto.info;

      if (updateProductDto.packing && updateProductDto.packing.length > 0) {
        const articles = updateProductDto.packing.map((item) => item.article);
        const duplicateArticles = articles.filter((item, index) => articles.indexOf(item) !== index);
        if (duplicateArticles.length > 0) {
          throw new BadRequestException(`Duplicate articles found in packing: ${duplicateArticles.join(', ')}`);
        }

        for (const item of updateProductDto.packing) {
          if (!item.volume || !item.article) {
            throw new BadRequestException('Invalid packing item: volume and article are required');
          }
          const existingProduct = await transactionalEntityManager
            .createQueryBuilder(Product, 'product')
            .where('product.packing @> :article AND product.id != :id', { article: [{ article: item.article }], id })
            .getOne();
          if (existingProduct) {
            throw new BadRequestException(`Article ${item.article} already exists in another product`);
          }
        }
        product.packing = updateProductDto.packing;
      }

      if (updateProductDto.categoryId) {
        const category = await this.categoriesService.findOne(updateProductDto.categoryId);
        if (!category) {
          throw new BadRequestException(`Category with ID ${updateProductDto.categoryId} does not exist`);
        }
        product.category = category;
      }

      try {
        const savedProduct = await transactionalEntityManager.save(Product, product);
        // Faqat yangilangan mahsulotni qaytarish
        const result = await transactionalEntityManager.findOne(Product, {
          where: { id: savedProduct.id },
          relations: ['category'],
        });
        if (!result) {
          throw new NotFoundException(`Failed to retrieve updated product with ID ${savedProduct.id}`);
        }
        return result;
      } catch (error) {
        if (error instanceof QueryFailedError && error.message.includes('invalid input syntax for type json')) {
          throw new BadRequestException('Invalid JSON format in packing field');
        }
        throw error;
      }
    });
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