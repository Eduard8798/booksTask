import type {
    UserRole,
    RegisterRequest,
} from '@/features/auth/types/auth.types';

export interface CreateUserRequest extends RegisterRequest {
    role: UserRole;
}

export interface UpdateUserRequest {
    id: number;
    data: Partial<CreateUserRequest>;
}