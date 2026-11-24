'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';

import type { User } from '@/features/auth/types/auth.types';

import {
    userSchema,
    createUserSchema,
    type UserFormValues,
} from '../schemas/user.schema';

interface UserFormProps {
    user?: User;
    isLoading?: boolean;
    error?: string;
    onSubmit: (data: UserFormValues) => Promise<void>;
    onCancel: () => void;
}

export default function UserForm({
                                     user,
                                     isLoading = false,
                                     error,
                                     onSubmit,
                                     onCancel,
                                 }: UserFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
        resolver: zodResolver(
            user ? userSchema : createUserSchema,
        ),

        defaultValues: {
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            role: user?.role ?? 'USER',
        },
    });

    const isBusy = isLoading || isSubmitting;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
        >
            {error && <Alert message={error} />}

            <Input
                label="Ім’я"
                placeholder="Введіть ім’я"
                error={errors.name?.message}
                disabled={isBusy}
                {...register('name')}
            />

            <Input
                label="Електронна пошта"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                disabled={isBusy}
                {...register('email')}
            />

            <Input
                label={user ? 'Новий пароль' : 'Пароль'}
                type="password"
                autoComplete="new-password"
                placeholder={
                    user
                        ? 'Залиште порожнім, щоб не змінювати'
                        : 'Щонайменше 8 символів'
                }
                error={errors.password?.message}
                disabled={isBusy}
                {...register('password')}
            />

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-700"
                >
                    Роль
                </label>

                <select
                    id="role"
                    disabled={isBusy}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#365B45] focus:ring-2 focus:ring-green-100"
                    {...register('role')}
                >
                    <option value="USER">Користувач</option>
                    <option value="ADMIN">Адміністратор</option>
                </select>

                {errors.role && (
                    <span className="text-xs text-red-600">
            {errors.role.message}
          </span>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isBusy}
                >
                    Скасувати
                </Button>

                <Button
                    type="submit"
                    isLoading={isBusy}
                >
                    {user
                        ? 'Зберегти зміни'
                        : 'Додати користувача'}
                </Button>
            </div>
        </form>
    );
}