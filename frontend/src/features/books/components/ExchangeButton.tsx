'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useAppSelector } from '@/store/hooks';

import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';

import { getApiError } from '@/shared/utils/getApiError';

import {
    useCreateExchangeMutation,
    useGetSentExchangesQuery,
} from '../../exchanges/api/exchangesApi';

interface ExchangeButtonProps {
    bookId: number;
    ownerId: number;
}

export default function ExchangeButton({
                                           bookId,
                                           ownerId,
                                       }: ExchangeButtonProps) {
    const { user, status } = useAppSelector(
        (state) => state.auth,
    );

    const [serverError, setServerError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [createExchange, { isLoading }] =
        useCreateExchangeMutation();

    const isOwner = user?.id === ownerId;

    const { data: sentExchanges, isLoading: isChecking } =
        useGetSentExchangesQuery(undefined, {
            skip: status !== 'authenticated' || isOwner,
        });

    const hasExistingRequest = sentExchanges?.some(
        (exchange) => exchange.bookId === bookId,
    );

    const handleExchange = async () => {
        setServerError('');

        try {
            await createExchange({ bookId }).unwrap();

            setIsSuccess(true);
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    if (status === 'loading') {
        return (
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="space-y-3">
                <p className="text-sm text-gray-500">
                    Увійдіть в акаунт, щоб надіслати запит на обмін.
                </p>

                <Link
                    href="/login"
                    className="inline-flex rounded-lg bg-[#365B45] px-6 py-3 text-sm font-medium text-white hover:bg-[#294635]"
                >
                    Увійти в акаунт
                </Link>
            </div>
        );
    }

    if (isOwner) {
        return (
            <div className="space-y-3">
                <p className="rounded-lg bg-[#E5EDE2] px-4 py-3 text-sm font-medium text-[#365B45]">
                    Це ваша книга
                </p>

                <Link
                    href="/me/books"
                    className="text-sm font-medium text-[#365B45] hover:underline"
                >
                    Перейти до моїх книг →
                </Link>
            </div>
        );
    }

    if (isSuccess || hasExistingRequest) {
        return (
            <div className="space-y-4">
                <Alert
                    variant="success"
                    message={
                        isSuccess
                            ? 'Запит на обмін успішно створено!'
                            : 'Ви вже надіслали запит на обмін цією книгою.'
                    }
                />

                <Link
                    href="/me/exchanges"
                    className="text-sm font-medium text-[#365B45] hover:underline"
                >
                    Переглянути мої запити →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {serverError && <Alert message={serverError} />}

            <Button
                onClick={handleExchange}
                isLoading={isLoading || isChecking}
                className="w-full sm:w-auto"
            >
                {isLoading
                    ? 'Надсилання запиту...'
                    : 'Запросити обмін'}
            </Button>

            <p className="text-xs leading-relaxed text-gray-500">
                Власник книги отримає ваші контактні дані
                та список книг, які ви пропонуєте для обміну.
            </p>
        </div>
    );
}