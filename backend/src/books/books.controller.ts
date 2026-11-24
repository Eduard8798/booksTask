import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { BooksService } from './books.service.js';

import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { GetBooksQueryDto } from './dto/get-books-query.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

import type { User } from '../users/models/user.model.js';

@Controller()
export class BooksController {
    constructor(
        private readonly booksService: BooksService,
    ) {}

    @Get('books')
    findAll(@Query() query: GetBooksQueryDto) {
        return this.booksService.findAll(query);
    }

    @Get('books/:id')
    findById(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findById(id);
    }

    @Get('me/books')
    @UseGuards(JwtAuthGuard)
    findMyBooks(@CurrentUser() user: User) {
        return this.booksService.findMyBooks(user.id);
    }

    @Post('books')
    @UseGuards(JwtAuthGuard)
    create(
        @Body() dto: CreateBookDto,
        @CurrentUser() user: User,
    ) {
        return this.booksService.create(dto, user.id);
    }

    @Patch('books/:id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookDto,
        @CurrentUser() user: User,
    ) {
        return this.booksService.update(id, dto, user);
    }

    @Delete('books/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        await this.booksService.remove(id, user);
    }
}