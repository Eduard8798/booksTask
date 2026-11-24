import type { Book } from '../models/book.model.js';

export interface BooksResponse {
    items: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}