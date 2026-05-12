// @component BaseModal | @tipo componente | @versao 1.0.0
// > Modal genérico com header, corpo e ações — usa react-dom portal
// @api isOpen: bool, onClose: fn, title: string, children: node, actions: node[]

'use client';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, maxWidth = 'max-w-lg' }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto custom-scrollbar">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 transition-opacity duration-300 ease-in-out"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className={`relative w-full ${maxWidth} bg-card rounded-2xl border border-border transform transition-all animate-in fade-in zoom-in duration-300 ease-in-out my-auto`}>
                <div className="h-1 w-full bg-primary absolute top-0 left-0 transition-all rounded-t-2xl z-10"></div>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default BaseModal;
