import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BookDetails from '@/features/books/components/BookDetails';

export const metadata: Metadata = {
    title: 'Деталі книги | BookSwap',
};

interface BookDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BookDetailsPage({
                                                  params,
                                              }: BookDetailsPageProps) {
    const { id } = await params;

    const bookId = Number(id);

    if (
        !/^\d+$/.test(id) ||
        !Number.isSafeInteger(bookId) ||
        bookId <= 0
    ) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                href="/books"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#365B45]"
            >
                ← Повернутися до каталогу
            </Link>

            <BookDetails bookId={bookId} />
        </main>
    );
}