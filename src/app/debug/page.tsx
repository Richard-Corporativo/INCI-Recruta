'use client';

// @route DebugAuthPage | @tipo page | @versao 1.0.0
// > Debug de autenticação — estado, tokens, sessão
// @rule Bloqueada em produção — apenas disponível em development
// @calls DebugAuth — componente principal

import { notFound } from 'next/navigation';
import DebugAuth from '@src/views/DebugAuth';

export default function Page() {
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }
    return <DebugAuth />;
}
