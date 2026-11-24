import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ExchangeRequest } from './models/exchange-request.model.js';

import { ExchangesController } from './exchanges.controller.js';
import { ExchangesService } from './exchanges.service.js';

import { BooksModule } from '../books/books.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Module({
  imports: [
    SequelizeModule.forFeature([ExchangeRequest]),
    BooksModule,
  ],
  controllers: [ExchangesController],
  providers: [
    ExchangesService,
    JwtAuthGuard,
  ],
})
export class ExchangesModule {}