import React, { useEffect } from 'react';

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

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className={`relative w-full ${maxWidth} bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200`}>
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-blue-400 absolute top-0 left-0"></div>
                {children}
            </div>
        </div>
    );
};

export default BaseModal;
