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
            <div className="p-6 transition-colors">
                <div className="flex items-center gap-3 mb-4 transition-all">
                    <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${type === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-[24px]">
                            {type === 'danger' ? 'warning' : 'help'}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground transition-colors">{title}</h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-semibold transition-colors">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 px-4 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent active:scale-95 transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 h-10 px-4 text-sm font-semibold text-primary-foreground rounded-base transition-all duration-200 ease-in-out shadow-sm active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${type === 'danger' ? 'bg-destructive hover:bg-destructive-foreground' : 'bg-primary hover:bg-primary/90'}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmationModal;
