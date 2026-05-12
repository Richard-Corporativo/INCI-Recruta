// @component AuditResetModal | @tipo componente | @versao 1.0.0
// > Modal de confirmação com validação de texto para limpeza de logs
// @api isOpen: bool, onClose: fn, onConfirm: fn

import React, { useState } from 'react';
import BaseModal from '@src/components/shared/BaseModal';
import { Icon } from "@iconify/react";

interface AuditResetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

const AuditResetModal: React.FC<AuditResetModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [confirmText, setConfirmText] = useState('');
    const isValid = confirmText.toLowerCase() === 'reset';

    const handleConfirm = () => {
        if (isValid && !isLoading) {
            onConfirm();
            setConfirmText('');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[380px]">
            <div className="p-8">
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="size-16 rounded-2xl bg-white flex items-center justify-center border border-border/50 p-3">
                        <img 
                            src="/LOGO INCI.png" 
                            alt="INCI" 
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Limpeza de Auditoria</h3>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">
                            Esta ação irá remover todos os registros de auditoria com mais de <span className="text-red-600 font-bold">90 dias</span>. Esta operação não pode ser desfeita.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Digite <span className="text-red-600">reset</span> para confirmar
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Digite aqui..."
                            className="w-full h-12 px-4 rounded-2xl bg-muted/50 border border-border text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all placeholder:text-muted-foreground/30"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-all active:scale-95 border-none outline-none"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!isValid || isLoading}
                            className={cn(
                                "flex-1 h-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-none outline-none",
                                isValid && !isLoading
                                    ? "bg-red-600 text-white  red-500/20 hover:bg-red-700 active:scale-95"
                                    : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? (
                                <Icon icon="line-md:loading-twotone-loop" className="size-5" />
                            ) : (
                                <>
                                    <Icon icon="material-symbols:check-rounded" className="size-5" />
                                    Confirmar Reset
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

import { cn } from '@src/lib/utils';

export default AuditResetModal;
