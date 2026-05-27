// @route ResetPasswordPage | @tipo page | @versao 1.0.0
// > Redefinição de senha — token, nova senha, confirmação
// @calls ResetPassword — componente principal

import ResetPassword from '@src/views/ResetPassword';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ResetPassword />
        </Suspense>
    );
}
