import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info'
    };

    const iconColors = {
        success: 'text-primary',
        error: 'text-destructive',
        info: 'text-primary'
    };

    return (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3.5 rounded-full border-2 shadow-xl transition-all duration-500 ease-out transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'} 
            ${type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : ''}
            ${type === 'error' ? 'bg-rose-600 border-rose-500 text-white' : ''}
            ${type === 'info' ? 'bg-slate-900 border-slate-800 text-white' : ''}
        `}>
            <div className="size-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-white">{icons[type]}</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">{message}</span>
            <button
                onClick={() => setIsVisible(false)}
                className="ml-2 p-1 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 outline-none"
            >
                <span className="material-symbols-outlined text-base">close</span>
            </button>
        </div>
    );
};

export default Toast;
