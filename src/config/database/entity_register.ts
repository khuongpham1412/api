import { Bookmark } from 'src/models/bookmark.model';
import { Category } from 'src/models/category.model';
import { Folder } from 'src/models/folder.model';
import { Highlight } from 'src/models/highlight.model';
import { HighlightCategory } from 'src/models/higlight-category.model';
import { User } from 'src/models/user.model';

export const EntityRegister = [
  User,
  Folder,
  Bookmark,
  Highlight,
  Category,
  HighlightCategory,
];
