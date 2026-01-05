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
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-4 rounded-lg bg-card border border-border text-foreground shadow-2xl transition-all duration-300 ease-in-out transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
            <span className={`material-symbols-outlined transition-colors ${iconColors[type]}`}>{icons[type]}</span>
            <span className="text-sm font-semibold tracking-tight transition-colors">{message}</span>
            <button
                onClick={() => setIsVisible(false)}
                className="ml-4 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
};

export default Toast;
