'use client';

import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { baseApi } from '@/shared/api/baseApi';
import { tokenStorage } from '@/shared/utils/tokenStorage';

import {
    useLoginMutation,
    useRegisterMutation,
    useLazyGetCurrentUserQuery,
} from '../api/authApi';

import {
    setAuthenticated,
    setUnauthenticated,
} from '../store/authSlice';

import type {
    AuthTokens,
    LoginRequest,
    RegisterRequest,
} from '../types/auth.types';

export function useAuth() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { user, status } = useAppSelector(
        (state) => state.auth,
    );

    const [loginMutation, loginState] = useLoginMutation();

    const [registerMutation, registerState] =
        useRegisterMutation();

    const [getCurrentUser, userState] =
        useLazyGetCurrentUserQuery();

    const initializeSession = async (tokens: AuthTokens) => {
        dispatch(baseApi.util.resetApiState());

        tokenStorage.setTokens(tokens);

        try {
            const currentUser = await getCurrentUser().unwrap();

            dispatch(setAuthenticated(currentUser));

            router.replace('/books');
        } catch (error) {
            tokenStorage.clearTokens();

            dispatch(setUnauthenticated());
            dispatch(baseApi.util.resetApiState());

            throw error;
        }
    };

    const login = async (data: LoginRequest) => {
        const tokens = await loginMutation(data).unwrap();

        await initializeSession(tokens);
    };

    const register = async (data: RegisterRequest) => {
        const tokens = await registerMutation(data).unwrap();

        await initializeSession(tokens);
    };

    const logout = () => {
        tokenStorage.clearTokens();

        dispatch(setUnauthenticated());
        dispatch(baseApi.util.resetApiState());

        router.replace('/login');
    };

    return {
        user,
        status,
        login,
        register,
        logout,
        isLoading:
            loginState.isLoading ||
            registerState.isLoading ||
            userState.isFetching,
        isAuthenticated: status === 'authenticated',
        isAdmin: user?.role === 'ADMIN',
    };
}