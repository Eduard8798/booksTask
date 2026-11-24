interface AlertProps {
    message: string;
    variant?: 'error' | 'success';
}

const variants = {
    error: 'border-red-200 bg-red-50 text-red-700',
    success: 'border-green-200 bg-green-50 text-green-700',
};

export default function Alert({
                                  message,
                                  variant = 'error',
                              }: AlertProps) {
    return (
        <div
            role={variant === 'error' ? 'alert' : 'status'}
            className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]}`}
        >
            {message}
        </div>
    );
}