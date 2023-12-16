import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Folder } from './folder.model';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Folder, (folder) => folder.user, { cascade: true })
  folders: Promise<Folder[]>;

  async rootFolder() {
    const folders = await this.folders;
    const rootFolder = folders.find(
      (folder) => folder.parent_folder_id === null,
    );
    return rootFolder;
  }
}
