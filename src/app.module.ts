import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'caboose.proxy.rlwy.net',
      port: 38357,
      username: 'postgres',
      password: 'HyVvMQNgyRdwgFzDnhjcwaDwluHuGxLX',
      database: 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false,
        },
    }),
    ProductsModule,
    CategoriesModule,
  ],

})
export class AppModule {}
