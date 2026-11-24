import type { ReactNode } from 'react';

import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

export default function AdminLayout({
                                        children,
                                    }: {
    children: ReactNode;
}) {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            {children}
        </ProtectedRoute>
    );
}