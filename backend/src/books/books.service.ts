import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { Book } from './models/book.model.js';
import { User } from '../users/models/user.model.js';
import { UserRole } from '../users/enums/user-role.enum.js';

import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { GetBooksQueryDto } from './dto/get-books-query.dto.js';

import { BooksResponse } from './types/books-response.type.js';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book)
        private readonly bookModel: typeof Book,
    ) {}

    async findAll(query: GetBooksQueryDto): Promise<BooksResponse> {
        const { search, sort, page, limit } = query;

        const where: WhereOptions<Book> = search
            ? {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { author: { [Op.iLike]: `%${search}%` } },
                ],
            }
            : {};

        const { rows, count } = await this.bookModel.findAndCountAll({
            where,

            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
            ],

            order: [
                ['name', sort],
                ['id', 'ASC'],
            ],

            limit,
            offset: (page - 1) * limit,
        });

        return {
            items: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }

    async findById(id: number): Promise<Book> {
        const book = await this.bookModel.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!book) {
            throw new NotFoundException('Book not found');
        }

        return book;
    }

    async findMyBooks(ownerId: number): Promise<Book[]> {
        return this.bookModel.findAll({
            where: { ownerId },
            order: [['createdAt', 'DESC']],
        });
    }

    async create(
        dto: CreateBookDto,
        ownerId: number,
    ): Promise<Book> {
        const book = await this.bookModel.create({
            ...dto,
            ownerId,
        });

        return this.findById(book.id);
    }

    async update(
        id: number,
        dto: UpdateBookDto,
        user: User,
    ): Promise<Book> {
        const book = await this.findById(id);

        if (book.ownerId !== user.id) {
            throw new ForbiddenException(
                'You can only update your own books',
            );
        }

        await book.update(dto);

        return this.findById(id);
    }

    async remove(id: number, user: User): Promise<void> {
        const book = await this.findById(id);

        const isOwner = book.ownerId === user.id;
        const isAdmin = user.role === UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException(
                'You do not have permission to delete this book',
            );
        }

        await book.destroy();
    }
}