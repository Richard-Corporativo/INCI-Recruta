import React, { createContext, useContext, useState, ReactNode } from 'react';

export type QuickViewType = 'job' | 'candidate' | 'user' | 'role';

interface QuickViewContextData {
    isOpen: boolean;
    viewType: QuickViewType | null;
    data: any | null; // Generic data based on type
    openQuickView: (type: QuickViewType, data: any) => void;
    closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextData>({} as QuickViewContextData);

export const QuickViewProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewType, setViewType] = useState<QuickViewType | null>(null);
    const [data, setData] = useState<any | null>(null);

    const openQuickView = (type: QuickViewType, data: any) => {
        setData(data);
        setViewType(type);
        setIsOpen(true);
    };

    const closeQuickView = () => {
        setIsOpen(false);
        // Delay clearing data to avoid flicker during closing animation
        setTimeout(() => {
            setViewType(null);
            setData(null);
        }, 300);
    };

    return (
        <QuickViewContext.Provider value={{ isOpen, viewType, data, openQuickView, closeQuickView }}>
            {children}
        </QuickViewContext.Provider>
    );
};

export const useQuickView = () => useContext(QuickViewContext);
