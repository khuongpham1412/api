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
import { User } from './user.model';
import { Bookmark } from './bookmark.model';
import { HighlightCategory } from './higlight-category.model';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parent_folder_id: number;

  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Folder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_folder_id', referencedColumnName: 'id' })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder, { cascade: true })
  childFolders: Promise<Folder[]>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<User>;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.folder, { cascade: true })
  bookmarks: Promise<Bookmark[]>;

  async countBookmark() {
    const count = (await this.bookmarks).length;
    return count;
  }
}
