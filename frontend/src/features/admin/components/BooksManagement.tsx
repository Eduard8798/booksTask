'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {
    useGetBooksQuery,
    useDeleteBookMutation,
} from '@/features/books/api/booksApi';

import type {
    Book,
    BooksSort,
} from '@/features/books/types/books.types';

import BookCover from '@/features/books/components/BookCover';
import BooksFilters from '@/features/books/components/BooksFilters';

import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';
import EmptyState from '@/shared/components/ui/EmptyState';
import Pagination from '@/shared/components/ui/Pagination';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';

import { useDebounce } from '@/shared/hooks/useDebounce';
import { getApiError } from '@/shared/utils/getApiError';

const PAGE_LIMIT = 10;

export default function BooksManagement() {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<BooksSort>('ASC');
    const [page, setPage] = useState(1);

    const [selectedBook, setSelectedBook] =
        useState<Book | null>(null);

    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const debouncedSearch = useDebounce(search.trim());

    const {
        currentData: data,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetBooksQuery({
        search: debouncedSearch || undefined,
        sort,
        page,
        limit: PAGE_LIMIT,
    });

    const [deleteBook, { isLoading: isDeleting }] =
        useDeleteBookMutation();

    const isSearchPending =
        search.trim() !== debouncedSearch;

    useEffect(() => {
        if (data && page > Math.max(1, data.totalPages)) {
            setPage(Math.max(1, data.totalPages));
        }
    }, [data, page]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleSortChange = (value: BooksSort) => {
        setSort(value);
        setPage(1);
    };

    const openDeleteDialog = (book: Book) => {
        setServerError('');
        setSuccessMessage('');
        setSelectedBook(book);
    };

    const closeDeleteDialog = () => {
        setServerError('');
        setSelectedBook(null);
    };

    const handleDelete = async () => {
        if (!selectedBook) {
            return;
        }

        setServerError('');

        try {
            await deleteBook(selectedBook.id).unwrap();

            setSuccessMessage('Книгу успішно видалено!');

            closeDeleteDialog();
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    return (
        <section className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Управління книгами
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Переглядайте та видаляйте книги користувачів.
                </p>
            </div>

            {successMessage && (
                <Alert
                    variant="success"
                    message={successMessage}
                />
            )}

            <BooksFilters
                search={search}
                sort={sort}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
            />

            {data && (
                <p className="text-sm text-gray-500">
                    Знайдено книг: {data.total}
                </p>
            )}

            {isError ? (
                <div className="space-y-4">
                    <Alert message={getApiError(error)} />

                    <Button
                        variant="secondary"
                        onClick={() => refetch()}
                    >
                        Спробувати ще раз
                    </Button>
                </div>
            ) : (!data && isFetching) || isSearchPending ? (
                <div
                    role="status"
                    className="animate-pulse space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
                >
          <span className="sr-only">
            Завантаження книг...
          </span>

                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={index}
                            className="h-16 rounded-lg bg-gray-100"
                        />
                    ))}
                </div>
            ) : data?.items.length ? (
                <>
                    <div
                        aria-busy={isFetching}
                        className={`overflow-hidden rounded-2xl border border-gray-200 bg-white transition-opacity ${
                            isFetching ? 'opacity-60' : 'opacity-100'
                        }`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                <tr className="text-xs uppercase tracking-wide text-gray-500">
                                    <th scope="col" className="px-5 py-4">
                                        Книга
                                    </th>

                                    <th scope="col" className="px-5 py-4">
                                        Власник
                                    </th>

                                    <th scope="col" className="px-5 py-4">
                                        Дата додавання
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-5 py-4 text-right"
                                    >
                                        Дії
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                {data.items.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/books/${book.id}`}
                                                className="group flex items-center gap-4"
                                            >
                                                <div className="w-14 shrink-0 overflow-hidden rounded-md">
                                                    <BookCover
                                                        photo={book.photo}
                                                        name={book.name}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900 group-hover:text-[#365B45]">
                                                        {book.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {book.author}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {book.owner?.name ?? '—'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                                            {new Date(
                                                book.createdAt,
                                            ).toLocaleDateString('uk-UA')}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                variant="danger"
                                                onClick={() => openDeleteDialog(book)}
                                                disabled={isFetching}
                                                className="!px-3 !py-2"
                                            >
                                                Видалити
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        page={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                        disabled={isFetching || isSearchPending}
                    />
                </>
            ) : (
                <EmptyState
                    title="Книг не знайдено"
                    description="У каталозі немає книг, які відповідають вашому запиту."
                    action={
                        debouncedSearch ? (
                            <Button
                                variant="secondary"
                                onClick={() => handleSearchChange('')}
                            >
                                Скинути пошук
                            </Button>
                        ) : undefined
                    }
                />
            )}

            {selectedBook && (
                <ConfirmDialog
                    title="Видалити книгу?"
                    description={`Ви дійсно бажаєте видалити книгу «${selectedBook.name}»? Пов’язані запити на обмін також будуть видалені.`}
                    isLoading={isDeleting}
                    error={serverError}
                    onConfirm={handleDelete}
                    onClose={closeDeleteDialog}
                />
            )}
        </section>
    );
}