import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateBookmarkDTO,
  DeleteBookmarkDTO,
  GetBookmarkDTO,
  LikeBookmarkDTO,
  UpdateBookmarkDTO,
} from 'src/dto/request.dto';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { BookmarkService } from 'src/services/bookmark.service';
import { HttpResponse } from 'src/utils/http-response';
import { Serialize } from 'src/utils/serialize';

@UseGuards(AuthGuard)
@Controller('/bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('/')
  async getBookmarks(@Query() query, @Req() req: AuthenticatedRequest) {
    const bookmarks = await this.bookmarkService.getBookmarks({
      user: req.user,
      folderId: query.folder_id ? +query.folder_id : undefined,
    });

    return new HttpResponse({
      data: {
        bookmarks: await Promise.all(
          bookmarks.map((bookmark) =>
            Serialize.bookmark({
              bookmark,
              showCountHiglight: true,
              showCountNote: true,
            }),
          ),
        ),
      },
    });
  }

  @Post('/')
  async createBookmark(
    @Body() createBookmarkDTO: CreateBookmarkDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const bookmark = await this.bookmarkService.createBookmark({
      createBookmarkDTO,
      user: req.user,
    });
    return new HttpResponse({
      data: {
        bookmark,
      },
    });
  }

  @Put('/')
  async updateBookmark(
    @Body() updateBookmarkDTO: UpdateBookmarkDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const bookmark = await this.bookmarkService.updateBookmark({
      user: req.user,
      updateBookmarkDTO,
    });
    return new HttpResponse({
      data: {
        bookmark,
      },
    });
  }

  @Delete('/:id')
  async deleteBookmark(@Param() params, @Req() req: AuthenticatedRequest) {
    await this.bookmarkService.deleteBookmark({
      bookmarkId: +params.id,
      user: req.user,
    });
    return new HttpResponse({});
  }

  @Post('/like')
  async likeBookmark(
    @Body() likeBookmarkDTO: LikeBookmarkDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id, isLike } = likeBookmarkDTO;
    const { user } = req;
    const likes = await this.bookmarkService.likeBookmark({
      user,
      bookmarkId: id,
      likeStatus: isLike,
    });
    return new HttpResponse({
      data: {
        likes,
      },
    });
  }

  @Get('/explore')
  async explore(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    const bookmarks = await this.bookmarkService.getSharedBookmarksByOther({
      user,
    });
    return new HttpResponse({
      data: {
        bookmarks: await Promise.all(
          bookmarks.map((bookmark) =>
            Serialize.bookmark({
              bookmark,
              showCountHiglight: true,
              showCountNote: true,
            }),
          ),
        ),
      },
    });
  }

  @Get('share')
  async getSharedBookmarks(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    const bookmarks = await this.bookmarkService.getSharedBookmarks({ user });
    return new HttpResponse({
      data: {
        bookmarks: await Promise.all(
          bookmarks.map((bookmark) =>
            Serialize.bookmark({
              bookmark,
              showCountHiglight: true,
              showCountNote: true,
            }),
          ),
        ),
      },
    });
  }
}
