import type { Book } from '@/features/books/types/books.types';

export interface OfferedBook {
    id: number;
    name: string;
    author: string;
}

export interface ExchangeParticipant {
    id: number;
    name: string;
}

export interface ExchangeRequest {
    id: number;
    senderId: number;
    recipientId: number;
    bookId: number;
    offeredBooks: OfferedBook[];
    createdAt: string;
    updatedAt: string;
}

export interface SentExchangeRequest extends ExchangeRequest {
    book: Book;
    recipient: ExchangeParticipant;
}

export interface ReceivedExchangeRequest extends ExchangeRequest {
    book: Book;
    sender: ExchangeParticipant & {
        email: string;
    };
}

export interface CreateExchangeRequest {
    bookId: number;
}