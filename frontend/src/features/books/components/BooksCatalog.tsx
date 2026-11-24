'use client';

import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { useDebounce } from '@/shared/hooks/useDebounce';

import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';
import EmptyState from '@/shared/components/ui/EmptyState';
import Pagination from '@/shared/components/ui/Pagination';

import { getApiError } from '@/shared/utils/getApiError';

import { useGetBooksQuery } from '../api/booksApi';
import type { BooksSort } from '../types/books.types';

import BookCard from './BookCard';
import BooksFilters from './BooksFilters';
import BooksSkeleton from './BooksSkeleton';

const PAGE_LIMIT = 12;

export default function BooksCatalog() {
    const user = useAppSelector((state) => state.auth.user);

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<BooksSort>('ASC');
    const [page, setPage] = useState(1);

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

    const isSearchPending = search.trim() !== debouncedSearch;

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

    const handlePageChange = (value: number) => {
        setPage(value);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const resetFilters = () => {
        setSearch('');
        setSort('ASC');
        setPage(1);
    };

    const isLoading = !data && isFetching;

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Каталог книг
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Знайдіть свою наступну улюблену книгу.
                </p>
            </div>

            <BooksFilters
                search={search}
                sort={sort}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
            />

            <div className="flex min-h-5 items-center justify-between">
                {data && (
                    <p
                        aria-live="polite"
                        className="text-sm text-gray-500"
                    >
                        Знайдено книг: {data.total}
                    </p>
                )}

                {(isFetching || isSearchPending) && (
                    <span className="ml-auto text-xs text-gray-400">
            Оновлення...
          </span>
                )}
            </div>

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
            ) : isLoading || isSearchPending ? (
                <BooksSkeleton count={PAGE_LIMIT} />
            ) : data?.items.length ? (
                <>
                    <div
                        aria-busy={isFetching}
                        className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4 lg:gap-6 ${
                            isFetching ? 'opacity-60' : 'opacity-100'
                        }`}
                    >
                        {data.items.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                isOwner={user?.id === book.ownerId}
                            />
                        ))}
                    </div>

                    <div className="pt-6">
                        <Pagination
                            page={page}
                            totalPages={data.totalPages}
                            onPageChange={handlePageChange}
                            disabled={isFetching || isSearchPending}
                        />
                    </div>
                </>
            ) : (
                <EmptyState
                    title={
                        debouncedSearch
                            ? 'Книг не знайдено'
                            : 'Каталог поки порожній'
                    }
                    description={
                        debouncedSearch
                            ? 'Спробуйте змінити пошуковий запит.'
                            : 'Незабаром тут з’являться книги для обміну.'
                    }
                    action={
                        debouncedSearch ? (
                            <Button
                                variant="secondary"
                                onClick={resetFilters}
                            >
                                Скинути фільтри
                            </Button>
                        ) : undefined
                    }
                />
            )}
        </section>
    );
}