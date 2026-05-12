'use client';

// @route ForgotPasswordPage | @tipo page | @versao 1.0.0
// > Esqueci minha senha — email, link de reset
// @calls ForgotPassword — componente principal

import ForgotPassword from '@src/views/ForgotPassword';

export default function Page() {
    return <ForgotPassword />;
}
