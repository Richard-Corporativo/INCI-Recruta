'use client';

// @route VerifyEmailPage | @tipo page | @versao 1.0.0
// > Verificação de email — token, confirmação, redirecionamento
// @calls VerifyEmail — componente principal

import VerifyEmail from '@src/views/public/VerifyEmail';

export default function Page() {
    return <VerifyEmail />;
}
