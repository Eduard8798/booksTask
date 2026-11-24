'use client';

import { useState } from 'react';
import Link from 'next/link';

import Alert from '@/shared/components/ui/Alert';
import Button from '@/shared/components/ui/Button';
import EmptyState from '@/shared/components/ui/EmptyState';

import { getApiError } from '@/shared/utils/getApiError';

import {
    useGetSentExchangesQuery,
    useGetReceivedExchangesQuery,
} from '../api/exchangesApi';

import ExchangeCard from './ExchangeCard';

type ExchangeTab = 'received' | 'sent';

export default function ExchangesList() {
    const [activeTab, setActiveTab] =
        useState<ExchangeTab>('received');

    const receivedQuery = useGetReceivedExchangesQuery();
    const sentQuery = useGetSentExchangesQuery();

    const tabs: {
        value: ExchangeTab;
        label: string;
        count?: number;
    }[] = [
        {
            value: 'received',
            label: 'Вхідні',
            count: receivedQuery.data?.length,
        },
        {
            value: 'sent',
            label: 'Вихідні',
            count: sentQuery.data?.length,
        },
    ];

    const activeQuery =
        activeTab === 'received' ? receivedQuery : sentQuery;

    const {
        data: exchanges,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = activeQuery;

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Мої обміни
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Переглядайте отримані та надіслані запити
                    на обмін книгами.
                </p>
            </div>

            <div className="inline-flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1.5">
                {tabs.map(({ value, label, count }) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={activeTab === value}
                        onClick={() => setActiveTab(value)}
                        className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition ${
                            activeTab === value
                                ? 'bg-[#365B45] text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {label}

                        {count !== undefined && (
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${
                                    activeTab === value
                                        ? 'bg-white/20'
                                        : 'bg-gray-100'
                                }`}
                            >
                {count}
              </span>
                        )}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div
                    role="status"
                    className="grid gap-5 lg:grid-cols-2"
                >
          <span className="sr-only">
            Завантаження запитів...
          </span>

                    {Array.from({ length: 2 }, (_, index) => (
                        <div
                            key={index}
                            className="animate-pulse space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
                        >
                            <div className="flex gap-4">
                                <div className="h-36 w-24 rounded-lg bg-gray-200" />

                                <div className="flex-1 space-y-4 py-2">
                                    <div className="h-5 w-24 rounded bg-gray-200" />
                                    <div className="h-6 w-3/4 rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 rounded bg-gray-100" />
                                </div>
                            </div>

                            <div className="h-16 rounded-lg bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="space-y-4">
                    <Alert message={getApiError(error)} />

                    <Button
                        variant="secondary"
                        onClick={() => refetch()}
                    >
                        Спробувати ще раз
                    </Button>
                </div>
            ) : exchanges?.length ? (
                <div
                    aria-busy={isFetching}
                    className="grid items-start gap-5 lg:grid-cols-2"
                >
                    {exchanges.map((exchange) => (
                        <ExchangeCard
                            key={exchange.id}
                            exchange={exchange}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={
                        activeTab === 'received'
                            ? 'Вхідних запитів поки немає'
                            : 'Вихідних запитів поки немає'
                    }
                    description={
                        activeTab === 'received'
                            ? 'Тут з’являться запити від користувачів, які зацікавляться вашими книгами.'
                            : 'Знайдіть цікаву книгу в каталозі та запропонуйте обмін.'
                    }
                    action={
                        <Link
                            href={
                                activeTab === 'received'
                                    ? '/me/books'
                                    : '/books'
                            }
                            className="inline-flex rounded-lg bg-[#365B45] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#294635]"
                        >
                            {activeTab === 'received'
                                ? 'Мої книги'
                                : 'Перейти до каталогу'}
                        </Link>
                    }
                />
            )}
        </section>
    );
}