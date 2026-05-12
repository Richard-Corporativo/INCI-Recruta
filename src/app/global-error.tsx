'use client';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error('[Global Error Boundary]', {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <html lang="pt-BR">
            <body className="bg-background text-foreground">
                <div className="flex h-screen w-full items-center justify-center px-4">
                    <div className="max-w-md w-full space-y-6 text-center">
                        <div className="flex justify-center">
                            <Icon icon="material-symbols:warning" className="size-20 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">
                                Erro no Sistema
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                A aplicação encontrou um problema crítico e precisará ser reiniciada.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="bg-muted rounded-lg p-4 text-left border border-border">
                                <p className="text-xs font-semibold text-destructive mb-2">
                                    Detalhes (Desenvolvimento):
                                </p>
                                <p className="text-xs font-mono text-muted-foreground break-words mb-2">
                                    {error.message}
                                </p>
                                {error.stack && (
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                            Stack trace
                                        </summary>
                                        <pre className="mt-2 text-xs overflow-auto max-h-40 bg-background p-2 rounded">
                                            {error.stack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => reset()}
                            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                            Tentar Novamente
                        </button>

                        <a
                            href="/"
                            className="block w-full px-4 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors font-medium text-sm"
                        >
                            Voltar para Home
                        </a>

                        <p className="text-xs text-muted-foreground">
                            Se o problema persistir, entre em contato com o suporte.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
}
