// @component AgendaPage | @tipo page | @versao 1.0.0
// > Rota /admin/agenda — Central de entrevistas

import React from 'react';
import AgendaView from '@src/views/AgendaView';

export const metadata = {
    title: 'Agenda de Entrevistas | INCI Recruta',
    description: 'Gerenciamento centralizado de entrevistas e processos seletivos.',
};

export default function AgendaPage() {
    return <AgendaView />;
}
