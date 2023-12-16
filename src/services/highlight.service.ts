import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateHighlightDTO,
  DeleteHighlightDTO,
  UpdateHighlightDTO,
} from 'src/dto/request.dto';
import { Highlight } from 'src/models/highlight.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { BookmarkService } from './bookmark.service';
import { EdenService } from './eden.service';
import Bull, { Queue } from 'bull';
import { BullService } from './bull.service';
import { InjectQueue } from '@nestjs/bull';
import { CONFIG } from 'src/config/config';
@Injectable()
export class HighlightService {
  constructor(
    @InjectQueue(CONFIG.EDEN_QUEUE_NAME)
    private edenQueue: Queue,
    @InjectRepository(Highlight)
    private highlightsRepository: Repository<Highlight>,
    private bookmarkService: BookmarkService,
  ) {}

  async getHighlightByBookmark(props: { user: User; bookmarkId: number }) {
    const { bookmarkId, user } = props;
    const highlight = await this.highlightsRepository.findBy({
      bookmark: {
        id: bookmarkId,
        folder: {
          user_id: user.id,
        },
      },
    });
    return highlight;
  }

  async getHighlightsByUser(props: { user: User }) {
    const { user } = props;
    const highlights = await this.highlightsRepository.findBy({
      bookmark: {
        folder: {
          user_id: user.id,
        },
      },
    });
    return highlights;
  }

  async getHighlightsByFolder(props: { user: User; folderId: number }) {
    const { folderId, user } = props;
    const highlights = await this.highlightsRepository.findBy({
      bookmark: {
        folder: {
          id: folderId,
          user_id: user.id,
        },
      },
    });
    return highlights;
  }

  async createHighlight(props: {
    user: User;
    createHighlightDTO: CreateHighlightDTO;
  }) {
    const {
      createHighlightDTO: {
        alias,
        bookmarkId,
        color,
        content,
        locatePath,
        note,
        isVoca,
        vocaNote,
        endIndex,
        startIndex,
      },
      user,
    } = props;

    //check is user own bookmark
    await this.bookmarkService.getBookmark({
      bookmarkId,
      user,
    });
    let highlight = new Highlight();
    highlight.alias = alias;
    highlight.bookmark_id = bookmarkId;
    highlight.color = color;
    highlight.content = content;
    highlight.startIndex = startIndex;
    highlight.endIndex = endIndex;
    highlight.locate_path = locatePath;
    highlight.note = note;
    if (isVoca) {
      highlight.voca_note = vocaNote;
      highlight.is_voca = isVoca;
    }

    highlight = await this.highlightsRepository.save(highlight);

    if (isVoca) {
      await this.edenQueue.add({
        text: content,
        highlightId: highlight.id,
      });
    }

    return highlight;
  }

  async updateHighlight(props: {
    user: User;
    updateHighlightDTO: UpdateHighlightDTO;
  }) {
    const {
      updateHighlightDTO: {
        isLearning,
        isRemember,
        isVoca,
        priority,
        id,
        alias,
        bookmarkId,
        color,
        content,
        locatePath,
        note,
        endIndex,
        startIndex,
      },
      user,
    } = props;

    const highlight = await this.highlightsRepository.findOneBy({
      id,
      bookmark: {
        folder: {
          user_id: user.id,
        },
      },
    });
    if (highlight) {
      throw new HttpException(
        'Highlight is not existed!',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (bookmarkId && bookmarkId != highlight.bookmark_id) {
      //check is user own bookmark
      await this.bookmarkService.getBookmark({
        bookmarkId,
        user,
      });
    }
    highlight.alias = alias ?? highlight.alias;
    highlight.bookmark_id = bookmarkId ?? highlight.bookmark_id;
    highlight.color = color ?? highlight.color;
    highlight.content = content ?? highlight.content;
    highlight.startIndex = startIndex ?? highlight.startIndex;
    highlight.endIndex = endIndex ?? highlight.endIndex;
    highlight.locate_path = locatePath ?? highlight.locate_path;
    highlight.note = note ?? highlight.note;
    highlight.is_learning = isLearning;
    highlight.is_remember = isRemember;
    highlight.is_voca = isVoca;
    highlight.priority = priority;
    return await this.highlightsRepository.save(highlight);
  }

  async deleteHighlight(props: {
    deleteHighlightDTO: DeleteHighlightDTO;
    user: User;
  }) {
    const {
      deleteHighlightDTO: { id },
      user,
    } = props;
    const highlight = await this.highlightsRepository.findOneBy({
      bookmark: {
        folder: {
          user_id: user.id,
        },
      },
      id,
    });
    await this.highlightsRepository.remove(highlight);
  }

  async getVocas(props: { user: User }) {
    const { user } = props;
    const highlights = await this.highlightsRepository.find({
      where: {
        is_voca: 1,
        bookmark: {
          folder: {
            user_id: user.id,
          },
        },
      },
    });
    return highlights;
  }

  async getVoca(props: { user: User; higlightId: number }) {
    const { higlightId, user } = props;
    const highlight = await this.highlightsRepository.findOneBy({
      is_voca: 1,
      bookmark: {
        folder: {
          user_id: user.id,
        },
      },
      id: higlightId,
    });
    if (!highlight) {
      throw new HttpException(
        'Voca highlight not existed!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return highlight;
  }

  async rememberVoca(props: {
    user: User;
    higlightId: number;
    rememberState: boolean;
  }) {
    const { higlightId, rememberState, user } = props;
    const voca = await this.getVoca({ user, higlightId });
    voca.is_remember = +rememberState;
    return await this.highlightsRepository.save(voca);
  }
}
