export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshRequest {
    refreshToken: string;
}