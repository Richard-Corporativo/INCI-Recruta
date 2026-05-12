'use client';

// @route CandidateSettingsPage | @tipo page | @versao 1.0.0
// > Configurações do candidato — perfil, notificações, privacidade
// @calls CandidateSettings — componente principal

import CandidateSettings from '@src/views/candidate/CandidateSettings';

export default function Page() {
    return <CandidateSettings />;
}
