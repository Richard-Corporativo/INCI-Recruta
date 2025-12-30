import React from 'react';
import BaseModal from './BaseModal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    type = 'primary'
}) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[400px]">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`size-10 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                        <span className="material-symbols-outlined text-[24px]">
                            {type === 'danger' ? 'warning' : 'help'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-sm ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmationModal;
