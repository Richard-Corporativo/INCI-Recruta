'use client';

// @component Providers | @tipo provider | @versao 1.0.0
// > Wrapper client-side — AuthProvider, ToastProvider, QuickViewProvider

/**
 * Client-side providers wrapper.
 * Encapsula AuthProvider, ToastProvider e QuickViewProvider
 * para uso no root layout (que é Server Component).
 */

import { AuthProvider } from '@src/context/AuthContext';
import { QuickViewProvider } from '@src/context/QuickViewContext';
import { ToastProvider } from '@src/components/ui/Toast';
import { Suspense } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <AuthProvider>
                <ToastProvider>
                    <QuickViewProvider>
                        {children}
                    </QuickViewProvider>
                </ToastProvider>
            </AuthProvider>
        </Suspense>
    );
}
