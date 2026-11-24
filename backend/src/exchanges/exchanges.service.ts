import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';

import { ExchangeRequest } from './models/exchange-request.model.js';
import { CreateExchangeDto } from './dto/create-exchange.dto.js';

import { BooksService } from '../books/books.service.js';
import { Book } from '../books/models/book.model.js';
import { User } from '../users/models/user.model.js';

@Injectable()
export class ExchangesService {
    constructor(
        @InjectModel(ExchangeRequest)
        private readonly exchangeModel: typeof ExchangeRequest,

        private readonly booksService: BooksService,
    ) {}

    async create(
        dto: CreateExchangeDto,
        senderId: number,
    ): Promise<ExchangeRequest> {
        const book = await this.booksService.findById(dto.bookId);

        if (book.ownerId === senderId) {
            throw new ForbiddenException(
                'You cannot request an exchange for your own book',
            );
        }

        const senderBooks =
            await this.booksService.findMyBooks(senderId);

        const offeredBooks = senderBooks.map(
            ({ id, name, author }) => ({
                id,
                name,
                author,
            }),
        );

        try {
            return await this.exchangeModel.create({
                senderId,
                recipientId: book.ownerId,
                bookId: book.id,
                offeredBooks,
            });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(
                    'Exchange request already exists',
                );
            }

            throw error;
        }
    }

    async findSent(
        senderId: number,
    ): Promise<ExchangeRequest[]> {
        return this.exchangeModel.findAll({
            where: { senderId },

            include: [
                {
                    model: Book,
                    as: 'book',
                },
                {
                    model: User,
                    as: 'recipient',
                    attributes: ['id', 'name'],
                },
            ],

            order: [['createdAt', 'DESC']],
        });
    }

    async findReceived(
        recipientId: number,
    ): Promise<ExchangeRequest[]> {
        return this.exchangeModel.findAll({
            where: { recipientId },

            include: [
                {
                    model: Book,
                    as: 'book',
                },
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'name', 'email'],
                },
            ],

            order: [['createdAt', 'DESC']],
        });
    }
}