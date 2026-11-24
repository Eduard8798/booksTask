import type { Metadata } from 'next';

import AuthLayout from '@/features/auth/components/AuthLayout';
import RegisterForm from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
    title: 'Реєстрація | BookSwap',
};

export default function RegisterPage() {
    return (
        <AuthLayout
            title="Створіть акаунт"
            description="Приєднуйтеся до спільноти книголюбів та знаходьте нові історії."
        >
            <RegisterForm />
        </AuthLayout>
    );
}