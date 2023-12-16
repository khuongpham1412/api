import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySQLDataSource } from './config/database/mysql';
import { EntityRegister } from './config/database/entity_register';
import { FolderService } from './services/folder.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { FolderController } from './controllers/folder.controller';
import { UserController } from './controllers/user.controller';
import { BookmarkController } from './controllers/bookmark.controller';
import { HighlightController } from './controllers/highlight.controller';
import { BookmarkService } from './services/bookmark.service';
import { HighlightService } from './services/highlight.service';
import { PostgreDataSource } from './config/database/postgre';
import { BullModule } from '@nestjs/bull';
import { CONFIG } from './config/config';
import { EdenQueueProcessor } from './queues/eden.queue';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { GoogleStrategy } from './controllers/google.stategy';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(MySQLDataSource),
    TypeOrmModule.forFeature(EntityRegister),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 11022,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: CONFIG.EDEN_QUEUE_NAME,
    }),
  ],
  controllers: [
    AuthController,
    FolderController,
    UserController,
    BookmarkController,
    HighlightController,
    CategoryController,
  ],
  providers: [
    FolderService,
    UserService,
    AuthService,
    BookmarkService,
    HighlightService,
    CategoryService,
    EdenQueueProcessor,
    GoogleStrategy,
  ],
})
export class AppModule {}
