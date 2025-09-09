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
  ParseIntPipe,
  UseGuards,
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
import { ConfigService } from '@nestjs/config';
import { AuthGuard, Roles, RolesGuard } from 'src/auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 3 }], {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'products'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
  ): Promise<Product> {
    const baseUrl = this.configService.get<string>('BASE_URL');

    const images = {
      image: files?.image
        ? files.image.map(
            (file) => `${baseUrl}/uploads/products/${file.filename}`,
          )
        : [],
    };

    return this.productsService.create(createProductDto, images);
  }

  @Get()
  async findAll(@Query() filters: FilterProductsDto): Promise<Product[]> {
    return this.productsService.findAll(filters);
  }

  @Get('search')
  async search(@Query() searchDto: SearchProductDto): Promise<Product[]> {
    if (!searchDto.query) {
      throw new BadRequestException(
        'Query param is required, e.g. ?query=ZIC',
      );
    }
    return this.productsService.search(searchDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    if (id <= 0) {
      throw new BadRequestException(
        'Invalid product ID: ID must be a positive number',
      );
    }
    return this.productsService.findOne(id);
  }

  
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 3 }], {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'products'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
  ): Promise<Product> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException(
        'Invalid product ID: ID must be a positive number',
      );
    }

    const baseUrl = this.configService.get<string>('BASE_URL');

    const images = files?.image
      ? {
          image: files.image.map(
            (file) => `${baseUrl}/uploads/products/${file.filename}`,
          ),
        }
      : undefined;

    return this.productsService.update(parsedId, updateProductDto, images);
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException(
        'Invalid product ID: ID must be a positive number',
      );
    }
    return this.productsService.remove(parsedId);
  }
}
