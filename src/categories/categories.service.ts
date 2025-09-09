import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, imgPath?: string): Promise<Category> {
    const category = this.categoriesRepository.create({
      title: {
        ru: createCategoryDto.title_ru,
        en: createCategoryDto.title_en,
      },
      img: imgPath,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .orderBy('category.updateOrder', 'DESC') // Most recently updated first
      .addOrderBy('category.id', 'ASC') // Fallback for same updateOrder
      .getMany();
  }


async findOne(id: number): Promise<Category> {
  const category = await this.categoriesRepository.findOne({
    where: { id },
    relations: ['products'],
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  return category;
}

async update(id: number, updateCategoryDto: UpdateCategoryDto, imgPath?: string): Promise<Category> {
    return await this.categoriesRepository.manager.transaction(async (transactionalEntityManager) => {
      const category = await this.findOne(id);

      const maxUpdateOrder = await transactionalEntityManager
        .createQueryBuilder(Category, 'category')
        .select('COALESCE(MAX(category.updateOrder), 0)', 'maxOrder')
        .getRawOne();

      category.updateOrder = maxUpdateOrder.maxOrder + 1;

      if (updateCategoryDto.title_ru || updateCategoryDto.title_en) {
        category.title = {
          ru: updateCategoryDto.title_ru || category.title.ru,
          en: updateCategoryDto.title_en || category.title.en,
        };
      }
      if (imgPath) {
        category.img = imgPath;
      }

      return transactionalEntityManager.save(category);
    });
  }
  
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}