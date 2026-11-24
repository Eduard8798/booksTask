import {
    forwardRef,
    type InputHTMLAttributes,
} from 'react';

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, name, className = '', ...props }, ref) => {
        const inputId = id ?? name;

        return (
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>

                <input
                    {...props}
                    ref={ref}
                    id={inputId}
                    name={name}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={`
            w-full rounded-lg border bg-white px-4 py-3
            text-sm outline-none transition
            placeholder:text-gray-400
            focus:ring-2
            ${
                        error
                            ? 'border-red-500 focus:ring-red-100'
                            : 'border-gray-300 focus:border-[#365B45] focus:ring-green-100'
                    }
            ${className}
          `}
                />

                {error && (
                    <span
                        id={`${inputId}-error`}
                        className="text-xs text-red-600"
                    >
            {error}
          </span>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;