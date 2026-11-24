import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Book } from './models/book.model.js';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Book]),
  ],
  controllers: [BooksController],
  providers: [
    BooksService,
    JwtAuthGuard,
  ],
  exports: [BooksService],
})
export class BooksModule {}