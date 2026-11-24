'use client';

import { useState } from 'react';

import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';
import Modal from '@/shared/components/ui/Modal';
import EmptyState from '@/shared/components/ui/EmptyState';
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog';

import { getApiError } from '@/shared/utils/getApiError';

import {
    useGetMyBooksQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
} from '../api/booksApi';

import type { Book } from '../types/books.types';
import type { BookFormValues } from '../schemas/book.schema';

import BookForm from './BookForm';
import MyBookCard from './MyBookCard';
import BooksSkeleton from './BooksSkeleton';

type BookDialog =
    | { type: 'create' }
    | { type: 'edit'; book: Book }
    | { type: 'delete'; book: Book }
    | null;

export default function MyBooksList() {
    const [dialog, setDialog] = useState<BookDialog>(null);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        data: books,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetMyBooksQuery();

    const [createBook, { isLoading: isCreating }] =
        useCreateBookMutation();

    const [updateBook, { isLoading: isUpdating }] =
        useUpdateBookMutation();

    const [deleteBook, { isLoading: isDeleting }] =
        useDeleteBookMutation();

    const isSaving = isCreating || isUpdating;

    const openDialog = (nextDialog: BookDialog) => {
        setServerError('');
        setSuccessMessage('');
        setDialog(nextDialog);
    };

    const closeDialog = () => {
        setServerError('');
        setDialog(null);
    };

    const handleSave = async (data: BookFormValues) => {
        setServerError('');

        try {
            if (dialog?.type === 'create') {
                await createBook(data).unwrap();

                setSuccessMessage('Книгу успішно додано!');
            } else if (dialog?.type === 'edit') {
                await updateBook({
                    id: dialog.book.id,
                    data,
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
            await deleteBook(dialog.book.id).unwrap();

            setSuccessMessage('Книгу успішно видалено!');

            closeDialog();
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Мої книги
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Керуйте власною колекцією книг для обміну.
                    </p>
                </div>

                <Button
                    onClick={() => openDialog({ type: 'create' })}
                >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>

                    Додати книгу
                </Button>
            </div>

            {successMessage && (
                <Alert
                    variant="success"
                    message={successMessage}
                />
            )}

            {books && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Кількість книг: {books.length}
                    </p>

                    {isFetching && (
                        <span className="text-xs text-gray-400">
              Оновлення...
            </span>
                    )}
                </div>
            )}

            {isLoading ? (
                <BooksSkeleton count={4} />
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
            ) : books?.length ? (
                <div
                    aria-busy={isFetching}
                    className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4 lg:gap-6 ${
                        isFetching ? 'opacity-60' : 'opacity-100'
                    }`}
                >
                    {books.map((book) => (
                        <MyBookCard
                            key={book.id}
                            book={book}
                            onEdit={(book) =>
                                openDialog({ type: 'edit', book })
                            }
                            onDelete={(book) =>
                                openDialog({ type: 'delete', book })
                            }
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="У вас поки немає книг"
                    description="Додайте свою першу книгу та запропонуйте її іншим користувачам для обміну."
                    action={
                        <Button
                            onClick={() => openDialog({ type: 'create' })}
                        >
                            Додати першу книгу
                        </Button>
                    }
                />
            )}

            {(dialog?.type === 'create' ||
                dialog?.type === 'edit') && (
                <Modal
                    title={
                        dialog.type === 'create'
                            ? 'Додати книгу'
                            : 'Редагувати книгу'
                    }
                    onClose={closeDialog}
                    isBusy={isSaving}
                >
                    <BookForm
                        key={
                            dialog.type === 'edit'
                                ? dialog.book.id
                                : 'create'
                        }
                        book={
                            dialog.type === 'edit'
                                ? dialog.book
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
                    title="Видалити книгу?"
                    description={`Ви дійсно бажаєте видалити книгу «${dialog.book.name}»? Пов’язані запити на обмін також будуть видалені. Цю дію неможливо скасувати.`}
                    isLoading={isDeleting}
                    error={serverError}
                    onConfirm={handleDelete}
                    onClose={closeDialog}
                />
            )}
        </section>
    );
}