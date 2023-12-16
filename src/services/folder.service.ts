import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateFolderDTO,
  DeleteFolderDTO,
  UpdateFolderDTO,
} from 'src/dto/request.dto';
import { Folder } from 'src/models/folder.model';
import { User } from 'src/models/user.model';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private foldersRepository: Repository<Folder>,
  ) {}

  async createRootFolder(props: { user: User }): Promise<Folder> {
    const { user } = props;
    return await this.createFolder({
      user,
      createFolderDTO: { name: 'root', parentId: null },
    });
  }

  async getFolders(props: { user: User }): Promise<Folder[]> {
    const { user } = props;
    const folders = await user.folders;
    return folders;
  }

  async createFolder(props: {
    user: User;
    createFolderDTO: CreateFolderDTO;
  }): Promise<Folder> {
    const {
      user,
      createFolderDTO: { name, parentId },
    } = props;
    const folder = new Folder();
    folder.name = name;
    folder.parent_folder_id = parentId;
    folder.user_id = user.id;
    return await this.foldersRepository.save(folder);
  }

  async updateFolder(props: {
    user: User;
    updateFolderDTO: UpdateFolderDTO;
  }): Promise<Folder> {
    const {
      user,
      updateFolderDTO: { name, parentId, id },
    } = props;
    const folder = await this.getFolderDetail({ user, folderId: id });
    folder.name = name ?? folder.name;
    folder.parent_folder_id = parentId ?? folder.parent_folder_id;
    return await this.foldersRepository.save(folder);
  }

  async deleteFolder(props: { user: User; deleteFolderDTO: DeleteFolderDTO }) {
    const {
      deleteFolderDTO: { id },
      user,
    } = props;

    const folder = await this.foldersRepository.findOne({
      where: {
        id,
        user_id: user.id,
        parent_folder_id: Not(IsNull()),
      },
    });

    if (!folder) {
      throw new Error('Cant not delete folder!');
    }

    await this.foldersRepository.remove(folder);
  }

  async getFolderDetail(props: {
    user: User;
    folderId: number;
  }): Promise<Folder> {
    const { folderId, user } = props;
    const folder = await this.foldersRepository.findOneBy({
      user_id: user.id,
      id: folderId,
    });
    if (!folder) {
      throw new HttpException('Folder not existed!', HttpStatus.BAD_REQUEST);
    }
    return folder;
  }
}
