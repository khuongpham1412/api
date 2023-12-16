import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Highlight } from './highlight.model';
import { Category } from './category.model';

@Entity()
export class HighlightCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  highlight_id: number;

  @Column()
  category_id: number;

  @Column({ default: 1 })
  status: number;

  @ManyToOne(() => Highlight, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'highlight_id', referencedColumnName: 'id' })
  highlight: Promise<Highlight>;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Promise<Category>;
}
