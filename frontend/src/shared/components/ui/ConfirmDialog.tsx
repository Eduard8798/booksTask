'use client';

import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';

interface ConfirmDialogProps {
    title: string;
    description: string;
    confirmLabel?: string;
    isLoading?: boolean;
    error?: string;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

export default function ConfirmDialog({
                                          title,
                                          description,
                                          confirmLabel = 'Видалити',
                                          isLoading = false,
                                          error,
                                          onConfirm,
                                          onClose,
                                      }: ConfirmDialogProps) {
    return (
        <Modal
            title={title}
            onClose={onClose}
            isBusy={isLoading}
        >
            <div className="space-y-5">
                <p className="text-sm leading-relaxed text-gray-600">
                    {description}
                </p>

                {error && <Alert message={error} />}

                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Скасувати
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}