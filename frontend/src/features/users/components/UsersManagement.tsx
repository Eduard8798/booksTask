'use client';

import { useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';
import Modal from '@/shared/components/ui/Modal';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';
import EmptyState from '@/shared/components/ui/EmptyState';

import { getApiError } from '@/shared/utils/getApiError';

import type { User } from '@/features/auth/types/auth.types';

import {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from '../api/usersApi';

import type { UserFormValues } from '../schemas/user.schema';

import UserForm from './UserForm';
import UsersTable from './UsersTable';

type UserDialog =
    | { type: 'create' }
    | { type: 'edit'; user: User }
    | { type: 'delete'; user: User }
    | null;

export default function UsersManagement() {
    const currentUser = useAppSelector(
        (state) => state.auth.user,
    );

    const [search, setSearch] = useState('');
    const [dialog, setDialog] = useState<UserDialog>(null);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        data: users,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetUsersQuery();

    const [createUser, { isLoading: isCreating }] =
        useCreateUserMutation();

    const [updateUser, { isLoading: isUpdating }] =
        useUpdateUserMutation();

    const [deleteUser, { isLoading: isDeleting }] =
        useDeleteUserMutation();

    const isSaving = isCreating || isUpdating;

    const normalizedSearch = search.trim().toLowerCase();

    const filteredUsers = users?.filter(
        (user) =>
            user.name.toLowerCase().includes(normalizedSearch) ||
            user.email.toLowerCase().includes(normalizedSearch),
    );

    const openDialog = (nextDialog: UserDialog) => {
        setServerError('');
        setSuccessMessage('');
        setDialog(nextDialog);
    };

    const closeDialog = () => {
        setServerError('');
        setDialog(null);
    };

    const handleSave = async (data: UserFormValues) => {
        setServerError('');

        try {
            if (dialog?.type === 'create') {
                await createUser(data).unwrap();

                setSuccessMessage('Користувача успішно створено!');
            } else if (dialog?.type === 'edit') {
                const { password, ...userData } = data;

                await updateUser({
                    id: dialog.user.id,
                    data: {
                        ...userData,
                        ...(password ? { password } : {}),
                    },
                }).unwrap();

                setSuccessMessage('Зміни успішно збережено!');
            } else {
                return;
            }

            closeDialog();
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    const handleDelete = async () => {
        if (dialog?.type !== 'delete') {
            return;
        }

        setServerError('');

        try {
            await deleteUser(dialog.user.id).unwrap();

            setSuccessMessage('Користувача успішно видалено!');

            closeDialog();
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Користувачі
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Всього користувачів: {users?.length ?? '—'}
                    </p>
                </div>

                <Button
                    onClick={() => openDialog({ type: 'create' })}
                >
                    + Додати користувача
                </Button>
            </div>

            {successMessage && (
                <Alert
                    variant="success"
                    message={successMessage}
                />
            )}

            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Пошук за ім’ям або email..."
                aria-label="Пошук користувачів"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#365B45] focus:ring-2 focus:ring-green-100 sm:max-w-md"
            />

            {isFetching && !isLoading && (
                <p className="text-xs text-gray-400">
                    Оновлення...
                </p>
            )}

            {isLoading ? (
                <div
                    role="status"
                    className="animate-pulse space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
                >
          <span className="sr-only">
            Завантаження користувачів...
          </span>

                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={index}
                            className="h-14 rounded-lg bg-gray-100"
                        />
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
            ) : filteredUsers?.length ? (
                <UsersTable
                    users={filteredUsers}
                    currentUserId={currentUser?.id}
                    onEdit={(user) =>
                        openDialog({ type: 'edit', user })
                    }
                    onDelete={(user) =>
                        openDialog({ type: 'delete', user })
                    }
                />
            ) : (
                <EmptyState
                    title="Користувачів не знайдено"
                    description={
                        normalizedSearch
                            ? 'Спробуйте змінити пошуковий запит.'
                            : 'Додайте нового користувача.'
                    }
                    action={
                        normalizedSearch ? (
                            <Button
                                variant="secondary"
                                onClick={() => setSearch('')}
                            >
                                Скинути пошук
                            </Button>
                        ) : (
                            <Button
                                onClick={() => openDialog({ type: 'create' })}
                            >
                                Додати користувача
                            </Button>
                        )
                    }
                />
            )}

            {(dialog?.type === 'create' ||
                dialog?.type === 'edit') && (
                <Modal
                    title={
                        dialog.type === 'create'
                            ? 'Додати користувача'
                            : 'Редагувати користувача'
                    }
                    onClose={closeDialog}
                    isBusy={isSaving}
                >
                    <UserForm
                        key={
                            dialog.type === 'edit'
                                ? dialog.user.id
                                : 'create'
                        }
                        user={
                            dialog.type === 'edit'
                                ? dialog.user
                                : undefined
                        }
                        isLoading={isSaving}
                        error={serverError}
                        onSubmit={handleSave}
                        onCancel={closeDialog}
                    />
                </Modal>
            )}

            {dialog?.type === 'delete' && (
                <ConfirmDialog
                    title="Видалити користувача?"
                    description={`Ви дійсно бажаєте видалити користувача «${dialog.user.name}»? Його книги та пов’язані запити на обмін також будуть видалені. Цю дію неможливо скасувати.`}
                    isLoading={isDeleting}
                    error={serverError}
                    onConfirm={handleDelete}
                    onClose={closeDialog}
                />
            )}
        </section>
    );
}