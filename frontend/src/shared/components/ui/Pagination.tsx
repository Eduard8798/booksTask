'use client';

import Button from './Button';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export default function Pagination({
                                       page,
                                       totalPages,
                                       onPageChange,
                                       disabled = false,
                                   }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const startPage = Math.max(
        1,
        Math.min(page - 2, totalPages - 4),
    );

    const pages = Array.from(
        { length: Math.min(5, totalPages) },
        (_, index) => startPage + index,
    );

    return (
        <nav
            aria-label="Пагінація"
            className="flex flex-wrap items-center justify-center gap-2"
        >
            <Button
                variant="secondary"
                disabled={disabled || page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="!px-3"
                aria-label="Попередня сторінка"
            >
                ←
            </Button>

            {startPage > 1 && (
                <span className="px-1 text-gray-400">...</span>
            )}

            {pages.map((pageNumber) => (
                <Button
                    key={pageNumber}
                    variant={pageNumber === page ? 'primary' : 'secondary'}
                    disabled={disabled}
                    aria-current={pageNumber === page ? 'page' : undefined}
                    onClick={() => onPageChange(pageNumber)}
                    className="!px-4"
                >
                    {pageNumber}
                </Button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <span className="px-1 text-gray-400">...</span>
            )}

            <Button
                variant="secondary"
                disabled={disabled || page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="!px-3"
                aria-label="Наступна сторінка"
            >
                →
            </Button>
        </nav>
    );
}