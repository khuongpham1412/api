import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateFolderDTO,
  DeleteFolderDTO,
  UpdateFolderDTO,
} from 'src/dto/request.dto';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { FolderService } from 'src/services/folder.service';
import { HttpResponse } from 'src/utils/http-response';
import { Serialize } from 'src/utils/serialize';

@UseGuards(AuthGuard)
@Controller('/folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/')
  async getFolders(@Req() req: AuthenticatedRequest) {
    const folders = await this.folderService.getFolders({ user: req.user });
    return new HttpResponse({
      data: {
        folders: await Promise.all(
          folders.map((folder) =>
            Serialize.folder({ folder, showBookmarkCount: true }),
          ),
        ),
      },
    });
  }

  @Post('/')
  async createFolder(
    @Body() createFolderDTO: CreateFolderDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const folder = await this.folderService.createFolder({
      createFolderDTO,
      user: req.user,
    });
    return new HttpResponse({
      data: {
        folder: await Serialize.folder({ folder }),
      },
    });
  }

  @Put('/')
  async updateFolder(
    @Body() updateFolderDTO: UpdateFolderDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const folder = await this.folderService.updateFolder({
      user: req.user,
      updateFolderDTO,
    });
    return new HttpResponse({
      data: {
        folder: await Serialize.folder({ folder }),
      },
    });
  }

  @Delete('/:id')
  async deleteFolder(@Param() params, @Req() req: AuthenticatedRequest) {
    await this.folderService.deleteFolder({
      deleteFolderDTO: { id: +params.id },
      user: req.user,
    });
    return new HttpResponse({});
  }
}
