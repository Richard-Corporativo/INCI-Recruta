'use client';

// @route CandidateLoginPage | @tipo page | @versao 1.0.0
// > Login de candidato — email/magic link, redirecionamento
// @calls CandidateLogin — componente principal

import CandidateLogin from '@src/views/public/CandidateLogin';

export default function Page() {
    return <CandidateLogin />;
}
