import type { Metadata } from 'next';

import AuthLayout from '@/features/auth/components/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
    title: 'Вхід | BookSwap',
};

export default function LoginPage() {
    return (
        <AuthLayout
            title="З поверненням!"
            description="Увійдіть, щоб знаходити та обмінюватися книгами."
        >
            <LoginForm />
        </AuthLayout>
    );
}