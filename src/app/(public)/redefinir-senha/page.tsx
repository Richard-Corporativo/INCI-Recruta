// @route RedefinirSenhaPage | @tipo page | @versao 1.0.0
// > Redefinição de senha — nova senha após link do email

import ResetPassword from '@src/views/ResetPassword';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ResetPassword />
        </Suspense>
    );
}
