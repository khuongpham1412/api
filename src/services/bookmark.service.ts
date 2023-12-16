import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from 'src/dto/request.dto';
import { Bookmark } from 'src/models/bookmark.model';
import { User } from 'src/models/user.model';
import { MoreThan, Not, Repository } from 'typeorm';
import { FolderService } from './folder.service';
import { Folder } from 'src/models/folder.model';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    private folderService: FolderService,
  ) {}

  async getBookmark(props: { user: User; bookmarkId: number }) {
    const { bookmarkId, user } = props;
    const bookmark = await this.bookmarksRepository.findOneBy({
      id: bookmarkId,
      folder: {
        user_id: user.id,
      },
    });
    if (!bookmark) {
      throw new HttpException(
        'Bookmark not found or you dont have permission!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return bookmark;
  }

  async getBookmarks(props: { user: User; folderId?: number }) {
    const { folderId, user } = props;
    const bookmarks = await this.bookmarksRepository.findBy({
      folder: {
        id: folderId,
        user_id: user.id,
      },
    });
    return bookmarks;
  }

  async createBookmark(props: {
    createBookmarkDTO: CreateBookmarkDTO;
    user: User;
  }) {
    const {
      user,
      createBookmarkDTO: { alias, description, folderId, image, title, url },
    } = props;
    const bookmark = new Bookmark();
    let folder: Folder = null;
    if (folderId) {
      folder = await this.folderService.getFolderDetail({
        user,
        folderId: folderId,
      });
    } else {
      folder = await user.rootFolder();
    }
    bookmark.folder_id = folder.id;
    bookmark.description = description;
    bookmark.image = image;
    bookmark.title = title;
    bookmark.url = url;
    return await this.bookmarksRepository.save(bookmark);
  }

  async updateBookmark(props: {
    user: User;
    updateBookmarkDTO: UpdateBookmarkDTO;
  }) {
    const {
      updateBookmarkDTO: {
        alias,
        description,
        folderId,
        id,
        image,
        title,
        url,
        isShare,
      },
      user,
    } = props;
    const bookmark = await this.bookmarksRepository.findOneByOrFail({
      id: id,
      folder: {
        user_id: user.id,
      },
    });
    bookmark.alias = alias ?? bookmark.alias;
    bookmark.description = description ?? bookmark.description;
    bookmark.folder_id = folderId ?? bookmark.folder_id;
    bookmark.image = image ?? bookmark.image;
    bookmark.title = title ?? bookmark.title;
    bookmark.url = url ?? bookmark.url;
    bookmark.is_share = isShare ?? bookmark.is_share;
    return await this.bookmarksRepository.save(bookmark);
  }

  async deleteBookmark(props: { user: User; bookmarkId: number }) {
    const { bookmarkId, user } = props;
    const bookmark = await this.bookmarksRepository.findOneBy({
      id: bookmarkId,
      folder: {
        user_id: user.id,
      },
    });
    await this.bookmarksRepository.remove(bookmark);
  }

  async getSharedBookmarks(props: { user: User }) {
    const { user } = props;
    const bookmarks = await this.bookmarksRepository.find({
      where: {
        folder: {
          user_id: user.id,
        },
        is_share: 1,
      },
    });
    return bookmarks;
  }

  async getSharedBookmarksByOther(props: { user: User }) {
    const { user } = props;
    const bookmarks = await this.bookmarksRepository.find({
      where: {
        is_share: 1,
        folder: {
          user_id: Not(user.id),
        },
      },
      order: {
        likes: 'DESC',
      },
    });
    return bookmarks;
  }

  async likeBookmark(props: {
    user: User;
    bookmarkId: number;
    likeStatus: boolean;
  }) {
    const { user, bookmarkId, likeStatus } = props;
    const bookmark = await this.getBookmark({ user, bookmarkId });
    if (!bookmark.is_share) {
      throw new HttpException(
        'This bookmark not exist or not share',
        HttpStatus.BAD_REQUEST,
      );
    }
    bookmark.likes += +likeStatus;
    return (await this.bookmarksRepository.save(bookmark)).likes;
  }
}
