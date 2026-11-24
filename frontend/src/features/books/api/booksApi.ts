import { baseApi } from '@/shared/api/baseApi';

import type {
    Book,
    BooksQuery,
    BooksResponse,
    CreateBookRequest,
    UpdateBookRequest,
} from '../types/books.types';

export const booksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBooks: builder.query<BooksResponse, BooksQuery>({
            query: (params) => ({
                url: '/books',
                params,
            }),

            providesTags: (result) => [
                { type: 'Books', id: 'LIST' },
                ...(result?.items.map(({ id }) => ({
                    type: 'Books' as const,
                    id,
                })) ?? []),
            ],
        }),

        getBookById: builder.query<Book, number>({
            query: (id) => `/books/${id}`,

            providesTags: (_result, _error, id) => [
                { type: 'Books', id },
            ],
        }),

        getMyBooks: builder.query<Book[], void>({
            query: () => '/me/books',

            providesTags: (result) => [
                { type: 'Books', id: 'MY_BOOKS' },
                ...(result?.map(({ id }) => ({
                    type: 'Books' as const,
                    id,
                })) ?? []),
            ],
        }),

        createBook: builder.mutation<Book, CreateBookRequest>({
            query: (body) => ({
                url: '/books',
                method: 'POST',
                body,
            }),

            invalidatesTags: [
                { type: 'Books', id: 'LIST' },
                { type: 'Books', id: 'MY_BOOKS' },
            ],
        }),

        updateBook: builder.mutation<Book, UpdateBookRequest>({
            query: ({ id, data }) => ({
                url: `/books/${id}`,
                method: 'PATCH',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Books', id },
                { type: 'Books', id: 'LIST' },
                { type: 'Books', id: 'MY_BOOKS' },
                'Exchanges',
            ],
        }),

        deleteBook: builder.mutation<void, number>({
            query: (id) => ({
                url: `/books/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, id) => [
                { type: 'Books', id },
                { type: 'Books', id: 'LIST' },
                { type: 'Books', id: 'MY_BOOKS' },
                'Exchanges',
            ],
        }),
    }),
});

export const {
    useGetBooksQuery,
    useGetBookByIdQuery,
    useGetMyBooksQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} = booksApi;