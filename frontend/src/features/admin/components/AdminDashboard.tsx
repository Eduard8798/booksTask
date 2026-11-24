'use client';

import { useState } from 'react';

import UsersManagement from '@/features/users/components/UsersManagement';

import BooksManagement from './BooksManagement';

type AdminTab = 'users' | 'books';

const tabs: {
    value: AdminTab;
    label: string;
}[] = [
    {
        value: 'users',
        label: 'Користувачі',
    },
    {
        value: 'books',
        label: 'Книги',
    },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] =
        useState<AdminTab>('users');

    return (
        <div className="space-y-8">
            <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#365B45]">
          BookSwap Administration
        </span>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                    Панель адміністратора
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Керуйте користувачами та каталогом книг.
                </p>
            </div>

            <div className="inline-flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1.5">
                {tabs.map(({ value, label }) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={activeTab === value}
                        onClick={() => setActiveTab(value)}
                        className={`rounded-lg px-6 py-3 text-sm font-medium transition ${
                            activeTab === value
                                ? 'bg-[#365B45] text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === 'users'
                ? <UsersManagement />
                : <BooksManagement />}
        </div>
    );
}