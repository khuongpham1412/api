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
import { Folder } from './folder.model';
import { Highlight } from './highlight.model';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ default: '' })
  alias: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  image: string;

  @Column({ default: 0 })
  is_share: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  folder_id: number;

  @ManyToOne(() => Folder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folder_id', referencedColumnName: 'id' })
  folder: Promise<Folder>;

  @OneToMany(() => Highlight, (highlight) => highlight.bookmark, {
    cascade: true,
  })
  higlights: Promise<Highlight[]>;

  async countHighlight() {
    const count = (await this.higlights).length;
    return count;
  }

  async countNote() {
    let count = 0;
    (await this.higlights).forEach((h) => {
      h.note && count++;
    });
    return count;
  }
}
