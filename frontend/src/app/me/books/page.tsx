import type { Metadata } from 'next';

import MyBooksList from '@/features/books/components/MyBooksList';

export const metadata: Metadata = {
    title: 'Мої книги | BookSwap',
};

export default function MyBooksPage() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <MyBooksList />
        </main>
    );
}