'use client';

import React, { createContext, useContext } from 'react';
import { useNotifications } from '@src/hooks/useNotifications';
import { CandidateNotification } from '@src/types';

interface NotificationsContextType {
    notifications: CandidateNotification[];
    isLoading: boolean;
    unreadCount: number;
    markRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useNotifications();
    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotificationsContext = (): NotificationsContextType => {
    const ctx = useContext(NotificationsContext);
    if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
    return ctx;
};
