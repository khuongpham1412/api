import { Request } from 'express';
import { User } from './models/user.model';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  declare interface AuthenticatedRequest extends Request {
    user: User;
    auth: JwtPayload;
  }
}
