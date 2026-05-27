// @route CandidateLoginPage | @tipo page | @versao 1.0.0
// > Login de candidato — email/magic link, redirecionamento
// @calls CandidateLogin — componente principal

import CandidateLogin from '@src/views/public/CandidateLogin';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <CandidateLogin />
        </Suspense>
    );
}
