'use client';

// @route CompanyRegisterPage | @tipo page | @versao 1.0.0
// > Registro de empresa — formulário corporativo, role recruiter
// @calls CompanyRegister — componente principal

import CompanyRegister from '@src/views/public/CompanyRegister';

export default function Page() {
    return <CompanyRegister />;
}
