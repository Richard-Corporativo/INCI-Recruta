'use client';

// @route RequestAccessPage | @tipo page | @versao 1.0.0
// > Solicitação de acesso — formulário, justificativa, aprovação
// @calls RequestAccess — componente principal

import RequestAccess from '@src/views/RequestAccess';

export default function Page() {
    return <RequestAccess />;
}
