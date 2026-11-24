'use client';

import { useState } from 'react';

interface BookCoverProps {
    photo: string;
    name: string;
}

export default function BookCover({
                                      photo,
                                      name,
                                  }: BookCoverProps) {
    const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

    return (
        <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-[#E9EDE6] p-5">
            {failedPhoto === photo || !photo ? (
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                        className="h-12 w-12"
                    >
                        <path d="M4 19V5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-2Zm0 0a2 2 0 0 1 2-2h14M8 7h8M8 11h5" />
                    </svg>

                    <span className="text-xs">
            Обкладинка відсутня
          </span>
                </div>
            ) : (
                <img
                    src={photo}
                    alt={`Обкладинка книги ${name}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedPhoto(photo)}
                    className="h-full w-full rounded-sm object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
            )}
        </div>
    );
}