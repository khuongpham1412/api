import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { FolderService } from './folder.service';
import { CONFIG } from 'src/config/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private folderService: FolderService,
  ) {}

  async signin(props: { email: string; password: string }): Promise<string> {
    const { email, password } = props;
    const user = (
      await this.usersRepository.find({
        where: {
          email,
        },
      })
    )[0];

    if (user) {
      const isCorrectPassword = await compare(password, user.password);
      if (isCorrectPassword) {
        return sign(
          {
            id: user.id,
            email: user.email,
            username: user.username,
            status: user.status,
          },
          process.env.AUTH_KEY as string,
        );
      }
    }

    throw new HttpException('Signin failed!', HttpStatus.BAD_REQUEST);
  }

  async signup(props: {
    email: string;
    password: string;
    username: string;
  }): Promise<User> {
    const { email, password, username } = props;

    const isEmailExisted = await this.usersRepository.exist({
      where: {
        email,
      },
    });

    if (isEmailExisted) {
      throw new HttpException('Email is existed!', HttpStatus.BAD_REQUEST);
    }

    let user = new User();
    user.email = email;
    user.password = await hash(password, CONFIG.SALT_ROUND);
    user.username = username;

    user = await this.usersRepository.save(user);
    await this.folderService.createRootFolder({ user });
    return user;
  }

  async verifyToken({ token }: { token: string }): Promise<User | null> {
    try {
      const payload: JwtPayload = verify(
        token,
        process.env.AUTH_KEY as string,
      ) as JwtPayload;
      const user = await this.usersRepository.findOneByOrFail({
        id: payload.id,
      });
      return user;
    } catch (error) {
      // Consider logging the error for debugging purposes
      return null;
    }
  }
}
