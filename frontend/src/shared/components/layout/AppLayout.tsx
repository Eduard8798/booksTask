'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import Header from './Header';
import Footer from './Footer';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({
                                      children,
                                  }: AppLayoutProps) {
    const pathname = usePathname();

    const isAuthPage = ['/login', '/register'].includes(pathname);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <div className="flex-1">
                {children}
            </div>

            <Footer />
        </div>
    );
}