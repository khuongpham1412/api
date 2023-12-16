import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import JWT from 'jsonwebtoken';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { FolderService } from './folder.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly folderService: FolderService,
  ) {}
}
