import { z } from 'zod';

export const bookSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Введіть назву книги')
        .max(150, 'Назва книги занадто довга'),

    author: z
        .string()
        .trim()
        .min(1, 'Введіть ім’я автора')
        .max(150, 'Ім’я автора занадто довге'),

    photo: z
        .string()
        .trim()
        .min(1, 'Вкажіть посилання на обкладинку')
        .max(2048, 'Посилання занадто довге')
        .url('Введіть коректне посилання')
        .refine(
            (value) => /^https?:\/\//i.test(value),
            'Посилання має починатися з http або https',
        ),
});

export type BookFormValues = z.infer<typeof bookSchema>;