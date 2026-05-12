'use client';

// @route CandidateWizardPage | @tipo page | @versao 1.0.0
// > Wizard de completar perfil candidato — etapas, validação
// @calls CandidateWizard — componente principal

import CandidateWizard from '@src/views/candidate/CandidateWizard';

export default function Page() {
    return <CandidateWizard />;
}
