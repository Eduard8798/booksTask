import { z } from 'zod';

const emailSchema = z
    .string()
    .trim()
    .email('Введіть коректну електронну пошту')
    .max(254)
    .toLowerCase();

const passwordSchema = z
    .string()
    .min(8, 'Пароль має містити щонайменше 8 символів')
    .max(72, 'Пароль занадто довгий')
    .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        'Пароль занадто довгий',
    );

export const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string()
        .min(1, 'Введіть пароль')
        .max(72),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, 'Ім’я має містити щонайменше 2 символи')
            .max(100, 'Ім’я занадто довге'),

        email: emailSchema,

        password: passwordSchema,

        confirmPassword: z
            .string()
            .min(1, 'Підтвердьте пароль'),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: 'Паролі не збігаються',
            path: ['confirmPassword'],
        },
    );

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;