import Button from '@/shared/components/ui/Button';

import type { User } from '@/features/auth/types/auth.types';

interface UsersTableProps {
    users: User[];
    currentUserId?: number;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export default function UsersTable({
                                       users,
                                       currentUserId,
                                       onEdit,
                                       onDelete,
                                   }: UsersTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                    <tr className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        <th scope="col" className="px-5 py-4">
                            ID
                        </th>

                        <th scope="col" className="px-5 py-4">
                            Користувач
                        </th>

                        <th scope="col" className="px-5 py-4">
                            Роль
                        </th>

                        <th scope="col" className="px-5 py-4">
                            Дата реєстрації
                        </th>

                        <th scope="col" className="px-5 py-4 text-right">
                            Дії
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                        const isCurrentUser =
                            user.id === currentUserId;

                        return (
                            <tr
                                key={user.id}
                                className="transition hover:bg-gray-50"
                            >
                                <td className="px-5 py-4 text-gray-500">
                                    {user.id}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5EDE2] font-semibold text-[#365B45]">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user.name}

                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs text-gray-400">
                              (Ви)
                            </span>
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            user.role === 'ADMIN'
                                ? 'bg-[#E5EDE2] text-[#365B45]'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {user.role === 'ADMIN'
                          ? 'Адмін'
                          : 'Користувач'}
                    </span>
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                                    {new Date(
                                        user.createdAt,
                                    ).toLocaleDateString('uk-UA')}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        {isCurrentUser ? (
                                            <span className="text-xs text-gray-400">
                          Ваш акаунт
                        </span>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => onEdit(user)}
                                                    className="!px-3 !py-2 text-xs"
                                                >
                                                    Редагувати
                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    onClick={() => onDelete(user)}
                                                    className="!px-3 !py-2 text-xs"
                                                >
                                                    Видалити
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}