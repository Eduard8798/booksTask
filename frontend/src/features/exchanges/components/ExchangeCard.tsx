import Link from 'next/link';

import BookCover from '@/features/books/components/BookCover';

import type {
    SentExchangeRequest,
    ReceivedExchangeRequest,
} from '../types/exchanges.types.';

interface ExchangeCardProps {
    exchange: SentExchangeRequest | ReceivedExchangeRequest;
}

export default function ExchangeCard({
                                         exchange,
                                     }: ExchangeCardProps) {
    const isReceived = 'sender' in exchange;

    const participant = isReceived
        ? exchange.sender
        : exchange.recipient;

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-start gap-4">
                <Link
                    href={`/books/${exchange.bookId}`}
                    className="w-24 shrink-0 overflow-hidden rounded-lg sm:w-28"
                >
                    <BookCover
                        photo={exchange.book.photo}
                        name={exchange.book.name}
                    />
                </Link>

                <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-[#E5EDE2] px-3 py-1 text-xs font-medium text-[#365B45]">
            {isReceived
                ? 'Вхідний запит'
                : 'Вихідний запит'}
          </span>

                    <Link
                        href={`/books/${exchange.bookId}`}
                        className="mt-3 block break-words text-lg font-semibold text-gray-900 hover:text-[#365B45]"
                    >
                        {exchange.book.name}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                        {exchange.book.author}
                    </p>

                    <p className="mt-3 text-sm text-gray-700">
                        {isReceived ? 'Відправник' : 'Отримувач'}:{' '}
                        <span className="font-medium">
              {participant.name}
            </span>
                    </p>

                    {isReceived && (
                        <a
                            href={`mailto:${exchange.sender.email}`}
                            className="mt-1 block break-all text-sm text-[#365B45] hover:underline"
                        >
                            {exchange.sender.email}
                        </a>
                    )}

                    <p className="mt-3 text-xs text-gray-400">
                        {new Date(exchange.createdAt).toLocaleDateString(
                            'uk-UA',
                        )}
                    </p>
                </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Книги, запропоновані для обміну
                </h3>

                {exchange.offeredBooks.length ? (
                    <ul className="space-y-2">
                        {exchange.offeredBooks.map((book) => (
                            <li
                                key={book.id}
                                className="rounded-lg bg-[#F5F7F3] px-4 py-3"
                            >
                                <p className="break-words text-sm font-medium text-gray-900">
                                    {book.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {book.author}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">
                        На момент створення запиту книги для обміну
                        були відсутні.
                    </p>
                )}
            </div>
        </article>
    );
}