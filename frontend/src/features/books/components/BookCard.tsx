import Link from 'next/link';

import BookCover from './BookCover';

import type { Book } from '../types/books.types';

interface BookCardProps {
    book: Book;
    isOwner?: boolean;
}

export default function BookCard({
                                     book,
                                     isOwner = false,
                                 }: BookCardProps) {
    return (
        <Link
            href={`/books/${book.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#365B45]/30 hover:shadow-lg"
        >
            <div className="relative">
                <BookCover
                    photo={book.photo}
                    name={book.name}
                />

                {isOwner && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[#365B45] shadow-sm">
            Ваша книга
          </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h2 className="line-clamp-2 font-semibold leading-snug text-gray-900">
                    {book.name}
                </h2>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {book.author}
                </p>

                <div className="mt-auto pt-4">
                    {book.owner && (
                        <p className="mb-3 truncate text-xs text-gray-400">
                            Власник: {book.owner.name}
                        </p>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm font-medium text-[#365B45]">
              Детальніше
            </span>

                        <span className="text-[#365B45] transition-transform group-hover:translate-x-1">
              →
            </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}