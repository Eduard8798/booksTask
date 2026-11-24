import type { Metadata } from 'next';
import Link from 'next/link';

import BooksCatalog from '@/features/books/components/BooksCatalog';

export const metadata: Metadata = {
    title: 'Каталог книг | BookSwap',
};

export default function BooksPage() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="relative mb-10 overflow-hidden rounded-3xl bg-[#E5EDE2] px-6 py-12 sm:px-12 sm:py-16">
                <div
                    aria-hidden="true"
                    className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[45px] border-white/25"
                />

                <div
                    aria-hidden="true"
                    className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-white/20"
                />

                <div className="relative max-w-2xl">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#365B45]">
                        Відкрийте нові історії
                    </span>

                    <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#294B37] sm:text-5xl">
                        Кожна книга заслуговує на нову історію.
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#526659] sm:text-base">
                        Знаходьте цікаві книги, діліться власними
                        та відкривайте новий світ читання разом
                        із BookSwap.
                    </p>

                    <Link
                        href="/me/books"
                        className="mt-7 inline-flex rounded-xl bg-[#365B45] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#294635]"
                    >
                        Додати свою книгу
                        <span className="ml-3">→</span>
                    </Link>
                </div>
            </section>

            <BooksCatalog />
        </main>
    );
}