import { z } from 'zod';

export const userSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Ім’я має містити щонайменше 2 символи')
        .max(100, 'Ім’я занадто довге'),

    email: z
        .string()
        .trim()
        .email('Введіть коректну електронну пошту')
        .max(254)
        .toLowerCase(),

    password: z
        .string()
        .refine(
            (value) =>
                value === '' ||
                (
                    value.length >= 8 &&
                    new TextEncoder().encode(value).length <= 72
                ),
            'Пароль має містити від 8 символів та не більше 72 байтів',
        ),

    role: z.enum(['USER', 'ADMIN']),
});

export const createUserSchema = userSchema.refine(
    (data) => data.password.length > 0,
    {
        message: 'Введіть пароль',
        path: ['password'],
    },
);

export type UserFormValues = z.infer<typeof userSchema>;