import type { Metadata } from 'next';

import ExchangesList from '@/features/exchanges/components/ExchangesList';

export const metadata: Metadata = {
    title: 'Мої обміни | BookSwap',
};

export default function ExchangesPage() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <ExchangesList />
        </main>
    );
}