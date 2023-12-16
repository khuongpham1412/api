import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { UserService } from 'src/services/user.service';
import { HttpResponse } from 'src/utils/http-response';
import { Serialize } from 'src/utils/serialize';

@UseGuards(AuthGuard)
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUser(@Req() req: AuthenticatedRequest) {
    return new HttpResponse({
      data: await Serialize.user({ user: req.user, showFolders: true }),
    });
  }
}
