// @route CandidateRegisterPage | @tipo page | @versao 1.0.1
// > Registro de candidato — formulário, validação, criação de conta
// @calls CandidateRegister — componente principal

import CandidateRegister from '@src/views/public/CandidateRegister';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <CandidateRegister />
        </Suspense>
    );
}
