import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/* -------------------------------------------------------------------------- */
/*                                    AUTH                                    */
/* -------------------------------------------------------------------------- */
export class SigninDTO {
  @IsEmail({})
  email: string;

  @MinLength(6)
  password: string;
}

export class SignupDTO {
  @IsEmail()
  email: string;

  @MinLength(6, {})
  password: string;

  @MinLength(1, {})
  username: string;
}

/* -------------------------------------------------------------------------- */
/*                                   FOLDER                                   */
/* -------------------------------------------------------------------------- */
export class CreateFolderDTO {
  @IsString()
  name: string;

  @IsNumber()
  parentId: number;
}

export class UpdateFolderDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  parentId: number;
}

export class DeleteFolderDTO {
  @IsNumber()
  id: number;
}

/* -------------------------------------------------------------------------- */
/*                                  BOOKMARK                                  */
/* -------------------------------------------------------------------------- */
export class GetBookmarkDTO {
  @IsNumber()
  folderId: number;
}

export class DeleteBookmarkDTO {
  @IsNumber()
  id: number;
}

export class CreateBookmarkDTO {
  @IsString()
  url: string;

  @IsString()
  alias: string;

  @IsNumber()
  @IsOptional()
  folderId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;
}

export class UpdateBookmarkDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  alias: string;

  @IsNumber()
  @IsOptional()
  folderId: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  isShare: number;
}

export class LikeBookmarkDTO {
  @IsNumber()
  id: number;

  @IsBoolean()
  isLike: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  HIGLIGHT                                  */
/* -------------------------------------------------------------------------- */
export class GetHighlightDTO {
  @IsNumber()
  id: number;
}
export class CreateHighlightDTO {
  @IsString()
  locatePath: string;

  @IsString()
  @IsOptional()
  alias: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  content: string;

  @IsNumber()
  startIndex: number;

  @IsNumber()
  endIndex: number;

  @IsString()
  @IsOptional()
  vocaNote: string;

  @IsNumber()
  @IsOptional()
  isVoca: number;

  @IsNumber()
  @IsOptional()
  isLearning: number;

  @IsNumber()
  @IsOptional()
  isRemember: number;

  @IsNumber()
  bookmarkId: number;

  @IsNumber()
  @IsOptional()
  priority: number;
}

export class UpdateHighlightDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  locatePath: string;

  @IsString()
  @IsOptional()
  alias: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  startIndex: number;

  @IsNumber()
  @IsOptional()
  endIndex: number;

  @IsString()
  @IsOptional()
  vocaNote: string;

  @IsNumber()
  @IsOptional()
  isVoca: number;

  @IsNumber()
  @IsOptional()
  isLearning: number;

  @IsNumber()
  @IsOptional()
  isRemember: number;

  @IsNumber()
  @IsOptional()
  bookmarkId: number;

  @IsNumber()
  @IsOptional()
  priority: number;
}

export class DeleteHighlightDTO {
  @IsNumber()
  id: number;
}

export class RememberVocaDTO {
  @IsNumber()
  id: number;

  @IsBoolean()
  remember: boolean;
}
