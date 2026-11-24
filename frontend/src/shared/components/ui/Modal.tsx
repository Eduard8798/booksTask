'use client';

import {
    useEffect,
    useId,
    useRef,
    type ReactNode,
} from 'react';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    isBusy?: boolean;
}

export default function Modal({
                                  title,
                                  children,
                                  onClose,
                                  isBusy = false,
                              }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog && !dialog.open) {
            dialog.showModal();
        }

        return () => {
            if (dialog?.open) {
                dialog.close();
            }
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();

                if (!isBusy) {
                    onClose();
                }
            }}
            onClick={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isBusy
                ) {
                    onClose();
                }
            }}
            className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
        >
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h2
                        id={titleId}
                        className="text-xl font-semibold text-gray-900"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={onClose}
                        aria-label="Закрити"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </dialog>
    );
}