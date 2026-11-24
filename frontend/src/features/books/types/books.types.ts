export interface BookOwner {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    name: string;
    author: string;
    photo: string;
    ownerId: number;
    owner?: BookOwner;
    createdAt: string;
    updatedAt: string;
}

export type BooksSort = 'ASC' | 'DESC';

export interface BooksQuery {
    search?: string;
    sort?: BooksSort;
    page?: number;
    limit?: number;
}

export interface BooksResponse {
    items: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CreateBookRequest {
    name: string;
    author: string;
    photo: string;
}

export interface UpdateBookRequest {
    id: number;
    data: Partial<CreateBookRequest>;
}