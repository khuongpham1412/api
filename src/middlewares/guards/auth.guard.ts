import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload, verify } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader) {
      // Split the header value to get the token part
      const token = authorizationHeader.split(' ')[1];
      return this.authService.verifyToken({ token }).then((user) => {
        if (!user) {
          throw new HttpException(
            'Authorization failed',
            HttpStatus.BAD_REQUEST,
          );
        }
        (request as AuthenticatedRequest).user = user;
        (request as AuthenticatedRequest).auth = user;
        return true;
      });
    } else {
      throw new HttpException('Missing token', HttpStatus.BAD_REQUEST);
    }
  }
}
