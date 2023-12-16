import { Controller, Get, Injectable } from '@nestjs/common';
import { AppService } from './app.service';
import { Repository } from 'typeorm';
import { Folder } from './models/folder.model';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.model';

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
}
