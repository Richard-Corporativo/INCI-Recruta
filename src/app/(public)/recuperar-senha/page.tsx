// @route CandidateForgotPasswordPage | @tipo page | @versao 1.0.0
// > Recuperação de senha candidato — email, reset link
// @calls CandidateForgotPassword — componente principal

import CandidateForgotPassword from '@src/views/public/CandidateForgotPassword';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <CandidateForgotPassword />
        </Suspense>
    );
}
