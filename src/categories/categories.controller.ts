import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, Roles, RolesGuard } from 'src/auth/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly configService: ConfigService,
  ) {}

  
  @Post()
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'categories'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const imgPath = img
      ? `${baseUrl}/uploads/categories/${img.filename}`
      : undefined;

    return this.categoriesService.create(createCategoryDto, imgPath);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'categories'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const imgPath = img
      ? `${baseUrl}/uploads/categories/${img.filename}`
      : undefined;

    return this.categoriesService.update(+id, updateCategoryDto, imgPath);
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
