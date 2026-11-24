const errorMessages: Record<string, string> = {
    'Invalid email or password':
        'Неправильна електронна пошта або пароль',

    'Email already exists':
        'Користувач із такою електронною поштою вже існує',

    'Book not found':
        'Книгу не знайдено',

    'Exchange request already exists':
        'Ви вже надіслали запит на обмін цією книгою',

    'You cannot request an exchange for your own book':
        'Ви не можете надіслати запит на обмін власної книги',

    'Forbidden resource':
        'У вас недостатньо прав для виконання цієї дії',

    Unauthorized:
        'Необхідно увійти в акаунт',

    'You cannot delete your own account':
        'Ви не можете видалити власний акаунт',

    'You cannot change your own role':
        'Ви не можете змінити власну роль',

    'You can only update your own books':
        'Ви можете редагувати лише власні книги',

    'You do not have permission to delete this book':
        'У вас немає прав для видалення цієї книги',

    'Invalid or expired refresh token':
        'Термін дії сесії закінчився',
};

export function getApiError(
    error: unknown,
    fallback = 'Щось пішло не так. Спробуйте ще раз.',
): string {
    if (!error || typeof error !== 'object') {
        return fallback;
    }

    if ('status' in error && error.status === 'FETCH_ERROR') {
        return 'Не вдалося підключитися до сервера';
    }

    if (
        'data' in error &&
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
    ) {
        const message = error.data.message;

        if (typeof message === 'string') {
            return errorMessages[message] ?? message;
        }

        if (Array.isArray(message)) {
            return message
                .filter((item): item is string => typeof item === 'string')
                .join('. ') || fallback;
        }
    }

    return fallback;
}