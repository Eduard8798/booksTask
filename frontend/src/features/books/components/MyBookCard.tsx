import Link from 'next/link';

import Button from '@/shared/components/ui/Button';

import type { Book } from '../types/books.types';

import BookCover from './BookCover';

interface MyBookCardProps {
    book: Book;
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
}

export default function MyBookCard({
                                       book,
                                       onEdit,
                                       onDelete,
                                   }: MyBookCardProps) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md">
            <Link
                href={`/books/${book.id}`}
                className="group block"
            >
                <BookCover
                    photo={book.photo}
                    name={book.name}
                />
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <Link
                    href={`/books/${book.id}`}
                    className="line-clamp-2 font-semibold text-gray-900 hover:text-[#365B45]"
                >
                    {book.name}
                </Link>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {book.author}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                    Додано:{' '}
                    {new Date(book.createdAt).toLocaleDateString('uk-UA')}
                </p>

                <div className="mt-auto pt-5">
                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => onEdit(book)}
                            className="w-full"
                        >
                            Редагувати
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() => onDelete(book)}
                            className="w-full"
                        >
                            Видалити
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}