import type { AuthTokens } from '@/features/auth/types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
    getAccessToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setTokens(tokens: AuthTokens): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    },

    clearTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};