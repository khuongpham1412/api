import { Controller, Get, Injectable } from '@nestjs/common';
import { AppService } from './app.service';
import { Repository } from 'typeorm';
import { Folder } from './models/folder.model';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.model';

import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Get()
  async getHello() {
    const user = await this.usersRepository.findOneBy({
      id: 1,
    });
    const folders = await user.folders;
    return this.appService.getHello();
  }

  // @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('auth/google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   return this.appService.googleLogin(req);
  // }
}
