'use client';

// @route CandidateDashboardPage | @tipo page | @versao 1.0.0
// > Dashboard do candidato — vagas candidatas, status, próximas etapas
// @calls CandidateDashboard — componente principal

import CandidateDashboard from '@src/views/candidate/CandidateDashboard';

export default function Page() {
    return <CandidateDashboard />;
}
