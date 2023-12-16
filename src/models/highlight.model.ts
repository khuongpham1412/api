import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Bookmark } from './bookmark.model';
import { HighlightCategory } from './higlight-category.model';

@Entity()
export class Highlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  locate_path: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ length: 1000 })
  note: string;

  @Column()
  color: string;

  @Column({ length: 2000 })
  content: string;

  @Column({ default: 1 })
  startIndex: number;

  @Column({ default: 1 })
  endIndex: number;

  @Column({ length: 2000, nullable: true })
  voca_note: string;

  @Column({ default: 0 })
  is_voca: number;

  @Column({ default: 0 })
  is_learning: number;

  @Column({ default: 0 })
  is_remember: number;

  @Column({ default: 1 })
  priority: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  bookmark_id: number;

  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => Bookmark, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookmark_id', referencedColumnName: 'id' })
  bookmark: Promise<Bookmark>;

  @OneToMany(
    () => HighlightCategory,
    (highlightCategory) => highlightCategory.highlight,
    { cascade: true },
  )
  highlightCategory: Promise<HighlightCategory[]>;

  async getCategories() {
    const pivot = await this.highlightCategory;
    return await Promise.all(pivot.map((i) => i.category));
  }
}
