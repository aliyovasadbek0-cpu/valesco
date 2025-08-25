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
    return this.categoriesRepository.find();
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
    const category = await this.findOne(id);
    if (updateCategoryDto.title_ru || updateCategoryDto.title_en) {
      category.title = {
        ru: updateCategoryDto.title_ru || category.title.ru,
        en: updateCategoryDto.title_en || category.title.en,
      };
    }
    if (imgPath) {
      category.img = imgPath;
    }
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}