'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';

import { getApiError } from '@/shared/utils/getApiError';

import { useAuth } from '../hooks/useAuth';

import {
    loginSchema,
    type LoginFormValues,
} from '../schemas/auth.schema';

export default function LoginForm() {
    const { login } = useAuth();

    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setServerError('');

        try {
            await login(data);
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
        >
            {serverError && <Alert message={serverError} />}

            <Input
                label="Електронна пошта"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Пароль"
                type="password"
                placeholder="Введіть пароль"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
            />

            <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? 'Вхід...' : 'Увійти'}
            </Button>

            <p className="text-center text-sm text-gray-500">
                Ще немає акаунта?{' '}
                <Link
                    href="/register"
                    className="font-medium text-[#365B45] hover:underline"
                >
                    Зареєструватися
                </Link>
            </p>
        </form>
    );
}