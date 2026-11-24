import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#365B45] text-white hover:bg-[#294635]',
    secondary: 'border border-gray-300 bg-white hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};

export default function Button({
                                   children,
                                   variant = 'primary',
                                   isLoading = false,
                                   disabled,
                                   className = '',
                                   type = 'button',
                                   ...props
                               }: ButtonProps) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            className={`
        inline-flex items-center justify-center gap-2
        rounded-lg px-5 py-3 text-sm font-medium
        transition disabled:opacity-50
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#365B45]
        ${variants[variant]}
        ${className}
      `}
        >
            {isLoading && (
                <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
            )}

            {children}
        </button>
    );
}