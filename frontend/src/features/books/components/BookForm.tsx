'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Alert from '@/shared/components/ui/Alert';

import {
    bookSchema,
    type BookFormValues,
} from '../schemas/book.schema';

import type { Book } from '../types/books.types';

import BookCover from './BookCover';

interface BookFormProps {
    book?: Book;
    isLoading?: boolean;
    error?: string;
    onSubmit: (data: BookFormValues) => Promise<void>;
    onCancel: () => void;
}

export default function BookForm({
                                     book,
                                     isLoading = false,
                                     error,
                                     onSubmit,
                                     onCancel,
                                 }: BookFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),

        defaultValues: {
            name: book?.name ?? '',
            author: book?.author ?? '',
            photo: book?.photo ?? '',
        },
    });

    const photo = watch('photo');
    const name = watch('name');

    const isBusy = isLoading || isSubmitting;

    const isValidPhoto =
        /^https?:\/\//i.test(photo) && URL.canParse(photo);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
        >
            {error && <Alert message={error} />}

            <Input
                label="Назва книги"
                placeholder="Наприклад, Clean Code"
                error={errors.name?.message}
                disabled={isBusy}
                {...register('name')}
            />

            <Input
                label="Автор"
                placeholder="Наприклад, Robert C. Martin"
                error={errors.author?.message}
                disabled={isBusy}
                {...register('author')}
            />

            <Input
                label="Посилання на обкладинку"
                type="url"
                placeholder="https://example.com/cover.jpg"
                error={errors.photo?.message}
                disabled={isBusy}
                {...register('photo')}
            />

            {isValidPhoto && (
                <div className="rounded-xl border border-gray-200 bg-[#F5F7F3] p-4">
                    <p className="mb-3 text-sm font-medium text-gray-600">
                        Попередній перегляд
                    </p>

                    <div className="mx-auto w-32 overflow-hidden rounded-lg">
                        <BookCover
                            photo={photo}
                            name={name || 'Книга'}
                        />
                    </div>
                </div>
            )}

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
                    {book ? 'Зберегти зміни' : 'Додати книгу'}
                </Button>
            </div>
        </form>
    );
}