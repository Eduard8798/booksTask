import { baseApi } from '@/shared/api/baseApi';

import type {
    CreateExchangeRequest,
    ExchangeRequest,
    SentExchangeRequest,
    ReceivedExchangeRequest,
} from '../types/exchanges.types.';

export const exchangesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createExchange: builder.mutation<
            ExchangeRequest,
            CreateExchangeRequest
        >({
            query: (body) => ({
                url: '/exchanges',
                method: 'POST',
                body,
            }),

            invalidatesTags: ['Exchanges'],
        }),

        getSentExchanges: builder.query<
            SentExchangeRequest[],
            void
        >({
            query: () => '/exchanges/sent',

            providesTags: ['Exchanges'],
        }),

        getReceivedExchanges: builder.query<
            ReceivedExchangeRequest[],
            void
        >({
            query: () => '/exchanges/received',

            providesTags: ['Exchanges'],
        }),
    }),
});

export const {
    useCreateExchangeMutation,
    useGetSentExchangesQuery,
    useGetReceivedExchangesQuery,
} = exchangesApi;