'use client';

// @route JobApplicationPage | @tipo page | @versao 1.0.0
// > Formulário de candidatura (slug + id)
// @calls JobApplication — componente principal

import JobApplication from '@src/views/public/JobApplication';

export default function Page() {
    return <JobApplication />;
}
