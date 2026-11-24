import type { Metadata } from 'next';

import StoreProvider from '@/store/StoreProvider';
import AuthProvider from '@/features/auth/components/AuthProvider';
import AppLayout from '@/shared/components/layout/AppLayout';

import './globals.css';

export const metadata: Metadata = {
    title: 'BookSwap',
    description: 'Знаходьте, діліться та обмінюйтеся книгами.',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
        <body>
        <StoreProvider>
            <AuthProvider>
                <AppLayout>
                    {children}
                </AppLayout>
            </AuthProvider>
        </StoreProvider>
        </body>
        </html>
    );
}