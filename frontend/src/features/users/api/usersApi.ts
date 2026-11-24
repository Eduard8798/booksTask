import { baseApi } from '@/shared/api/baseApi';

import type { User } from '@/features/auth/types/auth.types';

import type {
    CreateUserRequest,
    UpdateUserRequest,
} from '../types/users.types';

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',

            providesTags: (result) => [
                { type: 'Users', id: 'LIST' },
                ...(result?.map(({ id }) => ({
                    type: 'Users' as const,
                    id,
                })) ?? []),
            ],
        }),

        createUser: builder.mutation<User, CreateUserRequest>({
            query: (body) => ({
                url: '/users',
                method: 'POST',
                body,
            }),

            invalidatesTags: [
                { type: 'Users', id: 'LIST' },
            ],
        }),

        updateUser: builder.mutation<User, UpdateUserRequest>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Users', id },
                { type: 'Users', id: 'LIST' },
                'Auth',
                'Books',
                'Exchanges',
            ],
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: [
                'Users',
                'Books',
                'Exchanges',
            ],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;