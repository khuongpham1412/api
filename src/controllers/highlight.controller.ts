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
  CreateHighlightDTO,
  DeleteHighlightDTO,
  GetHighlightDTO,
  RememberVocaDTO,
  UpdateHighlightDTO,
} from 'src/dto/request.dto';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { Bookmark } from 'src/models/bookmark.model';
import { Highlight } from 'src/models/highlight.model';
import { BookmarkService } from 'src/services/bookmark.service';
import { HighlightService } from 'src/services/highlight.service';
import { HttpResponse } from 'src/utils/http-response';
import { Serialize } from 'src/utils/serialize';

@UseGuards(AuthGuard)
@Controller('/highlights')
export class HighlightController {
  constructor(
    private readonly highlightService: HighlightService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Get('/')
  async getHighlight(
    @Query() getHighlightDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    let highlights: Highlight[] = [];
    let bookmark: Bookmark;
    const responseData: any = {};
    if (getHighlightDTO.bookmark_id) {
      const bookmarkId = +getHighlightDTO.bookmark_id;
      highlights = await this.highlightService.getHighlightByBookmark({
        user,
        bookmarkId,
      });
      bookmark = await this.bookmarkService.getBookmark({
        bookmarkId,
        user,
      });
      responseData.bookmark = await Serialize.bookmark({
        bookmark,
        showCountHiglight: true,
        showCountNote: true,
      });
    } else {
      highlights = await this.highlightService.getHighlightsByUser({ user });
    }

    responseData.highlights = await Promise.all(
      highlights.map((highlight) => Serialize.highlight({ highlight })),
    );

    return new HttpResponse({
      data: responseData,
    });
  }

  @Post('/')
  async createHighlight(
    @Body() createHighlightDTO: CreateHighlightDTO,
    @Req() req,
  ) {
    const highlight = await this.highlightService.createHighlight({
      createHighlightDTO,
      user: req.user,
    });
    return new HttpResponse({
      data: { highlight },
    });
  }

  @Put('/')
  async updateHighlight(
    @Body() updateHighlightDTO: UpdateHighlightDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const highlight = await this.highlightService.updateHighlight({
      updateHighlightDTO,
      user: req.user,
    });
    return new HttpResponse({
      data: { highlight },
    });
  }

  @Delete('/:id')
  async DeleteHighlightDTO(
    @Param() deleteHighlightDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.highlightService.deleteHighlight({
      deleteHighlightDTO: { id: +deleteHighlightDTO.id },
      user: req.user,
    });
    return new HttpResponse({});
  }

  @Get('/voca')
  async getVoca(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    const highlights = await this.highlightService.getVocas({ user });
    return new HttpResponse({
      data: {
        highlights: await Promise.all(
          highlights.map((highlight) => Serialize.highlight({ highlight })),
        ),
      },
    });
  }

  @Post('/remember')
  async rememberVoca(
    @Body() rememberVocaDTO: RememberVocaDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id, remember } = rememberVocaDTO;
    const { user } = req;
    const voca = await this.highlightService.rememberVoca({
      user,
      higlightId: id,
      rememberState: remember,
    });
    return new HttpResponse({
      data: {
        highlight: await Serialize.highlight({ highlight: voca }),
      },
    });
  }
}
