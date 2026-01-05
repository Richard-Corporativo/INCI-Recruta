import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
              pointer-events-auto flex items-center gap-3 px-6 py-3.5 rounded-full shadow-xl border-2 min-w-[340px] max-w-lg
              animate-in fade-in slide-in-from-top-4 duration-500 ease-out fill-mode-both
              ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : ''}
              ${toast.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' : ''}
              ${toast.type === 'info' ? 'bg-slate-900 border-slate-800 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-amber-500 border-amber-400 text-white' : ''}
            `}
                    >
                        <div className="size-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">
                                {toast.type === 'success' ? 'check_circle' :
                                    toast.type === 'error' ? 'error' :
                                        toast.type === 'info' ? 'info' : 'warning'}
                            </span>
                        </div>
                        <p className="text-sm font-bold flex-1 tracking-tight leading-tight">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
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
