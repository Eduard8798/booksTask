'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/useAuth';
import Button from '@/shared/components/ui/Button';

const navigation = [
    { href: '/books', label: 'Каталог' },
    { href: '/me/books', label: 'Мої книги' },
    { href: '/me/exchanges', label: 'Обміни' },
];

export default function Header() {
    const pathname = usePathname();

    const {
        user,
        status,
        isAuthenticated,
        isAdmin,
        logout,
    } = useAuth();

    const links = [
        ...(isAuthenticated ? navigation : navigation.slice(0, 1)),
        ...(isAdmin
            ? [{ href: '/admin', label: 'Адміністрування' }]
            : []),
    ];

    const isActiveLink = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link
                    href="/books"
                    className="text-2xl font-bold tracking-tight text-[#365B45]"
                >
                    BookSwap
                </Link>

                <nav className="order-3 flex w-full flex-wrap items-center gap-5 text-sm sm:order-none sm:w-auto">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActiveLink(href) ? 'page' : undefined}
                            className={`font-medium transition ${
                                isActiveLink(href)
                                    ? 'text-[#365B45]'
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {status === 'loading' && (
                        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
                    )}

                    {isAuthenticated && user && (
                        <>
              <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 lg:block">
                {user.name}
              </span>

                            <Button
                                variant="secondary"
                                onClick={logout}
                                className="!px-4 !py-2"
                            >
                                Вийти
                            </Button>
                        </>
                    )}

                    {status === 'unauthenticated' && (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-[#365B45] hover:underline"
                            >
                                Увійти
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-[#365B45] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#294635]"
                            >
                                Реєстрація
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}