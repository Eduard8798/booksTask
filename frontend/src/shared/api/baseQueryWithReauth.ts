import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import type { AuthTokens } from '@/features/auth/types/auth.types';

import { setUnauthenticated } from '@/features/auth/store/authSlice';
import { tokenStorage } from '@/shared/utils/tokenStorage';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers) => {
        const accessToken = tokenStorage.getAccessToken();

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return headers;
    },
});

let refreshPromise: Promise<AuthTokens | null> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const requestToken = tokenStorage.getAccessToken();

    let result = await baseQuery(args, api, extraOptions);

    const isAuthRequest = [
        'login',
        'register',
        'refresh',
    ].includes(api.endpoint);

    if (result.error?.status !== 401 || isAuthRequest) {
        return result;
    }

    const currentToken = tokenStorage.getAccessToken();

    if (currentToken && currentToken !== requestToken) {
        return baseQuery(args, api, extraOptions);
    }

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
        tokenStorage.clearTokens();
        api.dispatch(setUnauthenticated());

        return result;
    }

    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions,
            );

            if (refreshResult.error || !refreshResult.data) {
                return null;
            }

            const tokens = refreshResult.data as AuthTokens;

            if (tokenStorage.getRefreshToken() !== refreshToken) {
                return null;
            }

            tokenStorage.setTokens(tokens);

            return tokens;
        })().finally(() => {
            refreshPromise = null;
        });
    }

    const tokens = await refreshPromise;

    if (tokens) {
        result = await baseQuery(args, api, extraOptions);
    } else if (tokenStorage.getRefreshToken() === refreshToken) {
        tokenStorage.clearTokens();
        api.dispatch(setUnauthenticated());
    }

    return result;
};