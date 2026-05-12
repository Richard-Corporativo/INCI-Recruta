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
import { Icon } from '@iconify/react';

function ProvidersFallback() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Icon icon="svg-spinners:ring-resize" className="size-10 text-primary" />
                <p className="text-sm text-muted-foreground">Carregando aplicação...</p>
            </div>
        </div>
    );
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <QuickViewProvider>
                    <Suspense fallback={<ProvidersFallback />}>
                        {children}
                    </Suspense>
                </QuickViewProvider>
            </ToastProvider>
        </AuthProvider>
    );
}
