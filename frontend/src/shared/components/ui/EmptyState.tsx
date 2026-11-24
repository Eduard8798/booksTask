import type { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: ReactNode;
}

export default function EmptyState({
                                       title,
                                       description,
                                       action,
                                   }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5EDE2]">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    className="h-8 w-8 text-[#365B45]"
                >
                    <path d="M12 7v14M3 4h4a5 5 0 0 1 5 5 5 5 0 0 1 5-5h4v14h-4a5 5 0 0 0-5 3 5 5 0 0 0-5-3H3V4Z" />
                </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
                {title}
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                {description}
            </p>

            {action && (
                <div className="mt-5">
                    {action}
                </div>
            )}
        </div>
    );
}