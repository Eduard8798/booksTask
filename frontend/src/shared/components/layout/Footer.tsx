import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    href="/books"
                    className="font-bold text-[#365B45]"
                >
                    BookSwap
                </Link>

                <p className="text-sm text-gray-500">
                    Кожна книга заслуговує на нову історію.
                </p>

                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} BookSwap
                </p>
            </div>
        </footer>
    );
}