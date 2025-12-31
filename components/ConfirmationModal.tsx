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
                    <div className={`size-10 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-[24px]">
                            {type === 'danger' ? 'warning' : 'help'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-bold">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-muted active:translate-y-[1px] transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 text-sm font-bold text-primary-foreground rounded-base transition-all duration-200 ease-in-out shadow-sm active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${type === 'danger' ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmationModal;
