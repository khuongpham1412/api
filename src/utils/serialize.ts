import { Bookmark } from 'src/models/bookmark.model';
import { Category } from 'src/models/category.model';
import { Folder } from 'src/models/folder.model';
import { Highlight } from 'src/models/highlight.model';
import { User } from 'src/models/user.model';

export class Serialize {
  static async user(resource: {
    user: User;
    showFolders?: boolean;
    showRootFolder?: boolean;
  }) {
    const { user, showFolders, showRootFolder } = resource;
    const data: any = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    showRootFolder &&
      (data.rootFolder = Serialize.folder({ folder: await user.rootFolder() }));

    if (showFolders) {
      const folders = await user.folders;
      data.folders = await Promise.all(
        folders.map((folder) => Serialize.folder({ folder })),
      );
    }

    return data;
  }

  static async folder(resource: {
    folder: Folder;
    showBookmarkCount?: boolean;
  }) {
    const { folder, showBookmarkCount } = resource;
    const data: any = {
      id: folder.id,
      parentId: folder.parent_folder_id,
      name: folder.name,
      status: folder.status,
    };

    showBookmarkCount && (data.bookmarkCount = await folder.countBookmark());

    return data;
  }

  static async bookmark(resource: {
    bookmark: Bookmark;
    showCountNote?: boolean;
    showCountHiglight?: boolean;
  }) {
    const { bookmark, showCountHiglight, showCountNote } = resource;
    const data: any = {
      id: bookmark.id,
      url: bookmark.url,
      alias: bookmark.alias,
      title: bookmark.title,
      description: bookmark.description,
      image: bookmark.image,
      status: bookmark.status,
      folderId: bookmark.folder_id,
      created: bookmark.created_at,
      updated: bookmark.updated_at,
      likes: bookmark.likes,
    };

    showCountHiglight &&
      (data.countHighlight = await bookmark.countHighlight());

    showCountNote && (data.countNote = await bookmark.countNote());

    return data;
  }

  static async highlight(resource: { highlight: Highlight }) {
    const { highlight } = resource;
    const categories = await highlight.getCategories();
    const data: any = {
      id: highlight.id,
      locate_path: highlight.locate_path,
      alias: highlight.alias,
      note: highlight.note,
      color: highlight.color,
      content: highlight.content,
      startIndex: highlight.startIndex,
      endIndex: highlight.endIndex,
      is_voca: highlight.is_voca,
      is_learning: highlight.is_learning,
      is_remember: highlight.is_remember,
      status: highlight.status,
      bookmark_id: highlight.bookmark_id,
      categories: await Promise.all(
        categories.map((category) => Serialize.category({ category })),
      ),
    };
    return data;
  }

  static async category(resource: { category: Category }) {
    const { category } = resource;
    const data: any = {
      id: category.id,
      name: category.name,
    };
    return data;
  }
}
