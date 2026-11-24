'use client';

import type { BooksSort } from '../types/books.types';

interface BooksFiltersProps {
    search: string;
    sort: BooksSort;
    onSearchChange: (search: string) => void;
    onSortChange: (sort: BooksSort) => void;
}

export default function BooksFilters({
                                         search,
                                         sort,
                                         onSearchChange,
                                         onSortChange,
                                     }: BooksFiltersProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 5 5" />
                </svg>

                <input
                    type="search"
                    value={search}
                    maxLength={150}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Пошук за назвою або автором..."
                    aria-label="Пошук книг"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#365B45] focus:ring-2 focus:ring-green-100"
                />
            </div>

            <select
                value={sort}
                aria-label="Сортування книг"
                onChange={(event) =>
                    onSortChange(event.target.value === 'DESC' ? 'DESC' : 'ASC')
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-[#365B45] focus:ring-2 focus:ring-green-100 sm:w-52"
            >
                <option value="ASC">За назвою: А–Я</option>
                <option value="DESC">За назвою: Я–А</option>
            </select>
        </div>
    );
}