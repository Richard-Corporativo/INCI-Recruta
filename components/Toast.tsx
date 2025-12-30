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

    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    return (
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-2xl transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${colors[type]}`}>
            <span className="material-symbols-outlined">{icons[type]}</span>
            <span className="text-sm font-bold">{message}</span>
            <button onClick={() => setIsVisible(false)} className="ml-2 hover:opacity-75">
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
};

export default Toast;
