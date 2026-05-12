// @component Toast | @tipo componente | @versao 1.0.0
// > Toast notifications — ToastProvider + useToast, auto-dismiss 5s
// @api ToastProvider, useToast(), toast(message, type?, duration?)

'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Icon } from "@iconify/react";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
    const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
    const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
    const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none w-full max-w-[90vw]">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-300
                            animate-in fade-in slide-in-from-top-2 duration-500 ease-out fill-mode-both w-fit max-w-[90vw]
                            ${toast.type === 'success' ? 'bg-emerald-50/95 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-400' : ''}
                            ${toast.type === 'error' ? 'bg-rose-50/95 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-900 dark:text-rose-400' : ''}
                            ${toast.type === 'info' ? 'bg-slate-50/95 dark:bg-slate-800/10 border-slate-200 dark:border-slate-500/20 text-slate-900 dark:text-slate-400' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-50/95 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-400' : ''}
                        `}
                    >
                        <div className={`
                            size-8 rounded-xl flex items-center justify-center shrink-0
                            ${toast.type === 'success' ? 'bg-emerald-500 text-white' : ''}
                            ${toast.type === 'error' ? 'bg-rose-500 text-white' : ''}
                            ${toast.type === 'info' ? 'bg-slate-800 text-white' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-500 text-white' : ''}
                        `}>
                            <Icon 
                                icon={
                                    toast.type === 'success' ? 'material-symbols:check-circle-rounded' :
                                    toast.type === 'error' ? 'material-symbols:error-rounded' :
                                    toast.type === 'info' ? 'material-symbols:info-rounded' : 
                                    'material-symbols:warning-rounded'
                                } 
                                className="size-5" 
                            />
                        </div>
                        
                        <div className="flex flex-col min-w-[180px]">
                            <p className="text-sm font-bold tracking-tight leading-tight">{toast.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors shrink-0 text-muted-foreground hover:text-foreground"
                        >
                            <Icon icon="material-symbols:close-rounded" className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
