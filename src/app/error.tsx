'use client';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[Error Boundary]', {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <Icon icon="material-symbols:error-outline" className="size-16 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Algo deu errado
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-muted rounded-lg p-4 text-left">
                        <p className="text-xs font-mono text-destructive break-words">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <button
                    onClick={() => reset()}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium text-sm"
                >
                    Tentar Novamente
                </button>

                <a
                    href="/"
                    className="block w-full px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors font-medium text-sm"
                >
                    Voltar ao Início
                </a>
            </div>
        </div>
    );
}
