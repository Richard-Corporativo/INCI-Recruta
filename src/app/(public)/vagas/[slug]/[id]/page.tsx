'use client';

// @route JobDetailPublicPage | @tipo page | @versao 1.0.0
// > Detalhe público da vaga dentro de uma empresa (slug + id)
// @calls JobDetailPublic — componente principal

import JobDetailPublic from '@src/views/public/JobDetailPublic';

export default function Page() {
    return <JobDetailPublic />;
}
