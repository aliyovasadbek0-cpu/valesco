import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description_ru: string;

  @Column({ nullable: true })
  description_en: string;

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  specifications: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  image: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  sae: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  density: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  kinematic_one: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  kinematic_two: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  viscosity: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  flash: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  temperature: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  base: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  info: string[];

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })
  packing: { volume: string; article: string }[];

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  category: Category;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', default: 0 })
  updateOrder: number;
}