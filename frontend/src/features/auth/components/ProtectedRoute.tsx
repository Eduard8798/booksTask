'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/store/hooks';

import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: UserRole;
}

export default function ProtectedRoute({
                                           children,
                                           requiredRole,
                                       }: ProtectedRouteProps) {
    const router = useRouter();

    const { user, status } = useAppSelector(
        (state) => state.auth,
    );

    const hasRequiredRole =
        !requiredRole || user?.role === requiredRole;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        }

        if (
            status === 'authenticated' &&
            !hasRequiredRole
        ) {
            router.replace('/books');
        }
    }, [status, hasRequiredRole, router]);

    if (status === 'loading') {
        return (
            <div
                role="status"
                className="flex min-h-[50vh] items-center justify-center"
            >
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-[#365B45]" />

                <span className="sr-only">
          Завантаження...
        </span>
            </div>
        );
    }

    if (
        status !== 'authenticated' ||
        !hasRequiredRole
    ) {
        return null;
    }

    return <>{children}</>;
}