import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  title: {
    ru: string;
    en: string;
  };

  @Column({ nullable: true })
  img: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ type: 'int', default: 0 })
  updateOrder: number;
}