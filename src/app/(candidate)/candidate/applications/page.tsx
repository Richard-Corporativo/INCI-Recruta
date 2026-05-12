'use client';

// @route MyApplicationsPage | @tipo page | @versao 1.0.0
// > Minhas candidaturas — lista de aplicações, status, ações
// @calls MyApplications — componente principal

import MyApplications from '@src/views/candidate/MyApplications';

export default function Page() {
    return <MyApplications />;
}
