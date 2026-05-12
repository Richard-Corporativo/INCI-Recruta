'use client';

// @route DebugAuthPage | @tipo page | @versao 1.0.0
// > Debug de autenticação — estado, tokens, sessão
// @calls DebugAuth — componente principal

import DebugAuth from '@src/views/DebugAuth';

export default function Page() {
    return <DebugAuth />;
}
