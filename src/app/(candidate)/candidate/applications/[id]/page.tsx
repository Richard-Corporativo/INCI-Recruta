'use client';

// @route ApplicationDetailPage | @tipo page | @versao 1.0.0
// > Detalhes da candidatura — status, histórico, feedback
// @calls ApplicationDetail — componente principal

import ApplicationDetail from '@src/views/candidate/ApplicationDetail';

export default function Page() {
    return <ApplicationDetail />;
}
