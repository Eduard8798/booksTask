import type { Metadata } from 'next';

import AdminDashboard from '@/features/admin/components/AdminDashboard';

export const metadata: Metadata = {
    title: 'Адміністрування | BookSwap',
};

export default function AdminPage() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <AdminDashboard />
        </main>
    );
}