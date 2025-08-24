import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  title: {
    ru: string;
    en: string;
  };

  @Column('jsonb', { nullable: true })
  description: {
    ru: string;
    en: string;
  };

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  packing: {
    volume: string;
    article: string;
  }[];

  @Column('jsonb', { nullable: true })
  advantages: {
    ru: string[];
    en: string[];
  };

  @Column('jsonb', { nullable: true })
  specifications: {
    ru: string[];
    en: string[];
  };

  @Column('jsonb', { nullable: true })
  characteristics: {
    ru: string[];
    en: string[];
  };

  @Column('jsonb', { nullable: true })
  documentation: string[];

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  image_middle: string;

  @Column({ nullable: true })
  image_bottom: string;

  @Column({ nullable: true })
  line: string;

  @Column({ nullable: true })
  viscosity: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  category: Category;
}