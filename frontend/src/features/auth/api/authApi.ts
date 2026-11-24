import { baseApi } from '@/shared/api/baseApi';

import type {
    AuthTokens,
    LoginRequest,
    RegisterRequest,
    User,
} from '../types/auth.types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthTokens, RegisterRequest>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),

        login: builder.mutation<AuthTokens, LoginRequest>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),

        getCurrentUser: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['Auth'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery,
} = authApi;