'use client';

import Link from 'next/link';

import { useAppSelector } from '@/store/hooks';

import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';

import { getApiError } from '@/shared/utils/getApiError';

import ExchangeButton from '@/features/books/components/ExchangeButton';

import { useGetBookByIdQuery } from '../api/booksApi';

import BookCover from './BookCover';

interface BookDetailsProps {
    bookId: number;
}

export default function BookDetails({
                                        bookId,
                                    }: BookDetailsProps) {
    const user = useAppSelector((state) => state.auth.user);

    const {
        data: book,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetBookByIdQuery(bookId);

    if (isLoading) {
        return (
            <div className="grid animate-pulse gap-8 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-[320px_1fr]">
                <div className="aspect-[3/4] rounded-xl bg-gray-200" />

                <div className="space-y-5 py-6">
                    <div className="h-8 w-3/4 rounded bg-gray-200" />
                    <div className="h-5 w-1/2 rounded bg-gray-100" />
                    <div className="h-20 rounded bg-gray-100" />
                    <div className="h-12 w-48 rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    if (isError || !book) {
        return (
            <div className="space-y-4">
                <Alert message={getApiError(error, 'Книгу не знайдено')} />

                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => refetch()}
                    >
                        Спробувати ще раз
                    </Button>

                    <Link
                        href="/books"
                        className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm"
                    >
                        До каталогу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 md:grid-cols-[320px_1fr] lg:gap-12">
            <div className="mx-auto w-full max-w-80 overflow-hidden rounded-xl">
                <BookCover
                    photo={book.photo}
                    name={book.name}
                />
            </div>

            <div className="flex flex-col justify-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#365B45]">
          Книга для обміну
        </span>

                <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {book.name}
                </h1>

                <p className="mt-3 text-lg text-gray-500">
                    {book.author}
                </p>

                <div className="my-7 space-y-4 rounded-xl bg-[#F5F7F3] p-5">
                    <div>
                        <p className="text-xs text-gray-500">
                            Власник книги
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {book.owner?.name ?? 'Невідомий власник'}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Додано до каталогу
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                            {new Date(book.createdAt).toLocaleDateString(
                                'uk-UA',
                                {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                },
                            )}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="mb-2 text-lg font-semibold">
                        Бажаєте прочитати цю книгу?
                    </h2>

                    <p className="mb-5 text-sm leading-relaxed text-gray-500">
                        Запропонуйте власнику обмінятися книгами
                        та відкрийте для себе нову історію.
                    </p>

                    <ExchangeButton
                        key={`${book.id}-${user?.id ?? 'guest'}`}
                        bookId={book.id}
                        ownerId={book.ownerId}
                    />
                </div>
            </div>
        </section>
    );
}