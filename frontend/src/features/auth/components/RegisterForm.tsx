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
    registerSchema,
    type RegisterFormValues,
} from '../schemas/auth.schema';

export default function RegisterForm() {
    const { register: registerUser } = useAuth();

    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError('');

        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            });
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
                label="Ім’я"
                placeholder="Ваше ім’я"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
            />

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
                placeholder="Щонайменше 8 символів"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
            />

            <Input
                label="Підтвердження пароля"
                type="password"
                placeholder="Повторіть пароль"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
            >
                {isSubmitting
                    ? 'Створення акаунта...'
                    : 'Зареєструватися'}
            </Button>

            <p className="text-center text-sm text-gray-500">
                Вже маєте акаунт?{' '}
                <Link
                    href="/login"
                    className="font-medium text-[#365B45] hover:underline"
                >
                    Увійти
                </Link>
            </p>
        </form>
    );
}