'use client';

// @route TwoFactorAuthPage | @tipo page | @versao 1.0.0
// > Autenticação 2FA — TOTP, verificação, backup codes
// @calls TwoFactorAuth — componente principal

import TwoFactorAuth from '@src/views/TwoFactorAuth';

export default function Page() {
    return <TwoFactorAuth />;
}
