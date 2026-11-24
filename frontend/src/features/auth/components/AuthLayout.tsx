import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

export default function AuthLayout({
                                       title,
                                       description,
                                       children,
                                   }: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
            <Link
                href="/books"
                className="mb-8 text-3xl font-bold tracking-tight text-[#365B45]"
            >
                BookSwap
            </Link>

            <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        {description}
                    </p>
                </div>

                {children}
            </section>

            <Link
                href="/books"
                className="mt-6 text-sm text-gray-500 transition hover:text-[#365B45]"
            >
                ← Повернутися до каталогу
            </Link>
        </main>
    );
}