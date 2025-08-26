import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Product } from './entities/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 3 }],
      {
        storage: diskStorage({
          destination: join(__dirname, '..', '..', 'Uploads', 'products'),
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
  ): Promise<Product> {
    console.log('Request Body:', createProductDto); // Debug uchun
    const images = {
      image: files?.image
        ? files.image.map((file) => `https://valesco-production.up.railway.app/uploads/products/${file.filename}`)
        : [],
    };
    return this.productsService.create(createProductDto, images);
  }

  @Get()
  async findAll(@Query() filters: FilterProductsDto): Promise<Product[]> {
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid product ID: ID must be a positive number');
    }
    return this.productsService.findOne(parsedId);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 3 }],
      {
        storage: diskStorage({
          destination: join(__dirname, '..', '..', 'Uploads', 'products'),
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
  ): Promise<Product> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid product ID: ID must be a positive number');
    }

    const images = files?.image
      ? {
          image: files.image.map((file) => `https://valesco-production.up.railway.app/uploads/products/${file.filename}`),
        }
      : undefined;

    return this.productsService.update(parsedId, updateProductDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid product ID: ID must be a positive number');
    }
    return this.productsService.remove(parsedId);
  }
}

@Controller('search')
export class SearchController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async search(@Query() searchDto: SearchProductDto): Promise<Product[]> {
    return this.productsService.search(searchDto);
  }
}
