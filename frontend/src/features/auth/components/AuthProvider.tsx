'use client';

import { useEffect, type ReactNode } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { tokenStorage } from '@/shared/utils/tokenStorage';

import { useLazyGetCurrentUserQuery } from '../api/authApi';

import {
    setAuthenticated,
    setUnauthenticated,
} from '../store/authSlice';

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({
                                         children,
                                     }: AuthProviderProps) {
    const dispatch = useAppDispatch();

    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        let isActive = true;

        const initializeAuth = async () => {
            const accessToken = tokenStorage.getAccessToken();
            const refreshToken = tokenStorage.getRefreshToken();

            if (!accessToken && !refreshToken) {
                dispatch(setUnauthenticated());

                return;
            }

            try {
                const user = await getCurrentUser().unwrap();

                if (isActive) {
                    dispatch(setAuthenticated(user));
                }
            } catch {
                if (isActive) {
                    dispatch(setUnauthenticated());
                }
            }
        };

        void initializeAuth();

        return () => {
            isActive = false;
        };
    }, [dispatch, getCurrentUser]);

    return <>{children}</>;
}