'use client';

// @route JobsListPage | @tipo page | @versao 1.0.0
// > Listagem pública de vagas — filtros, busca, paginação
// @calls JobsList — componente principal

import JobsList from '@src/views/public/JobsList';

export default function Page() {
    return <JobsList />;
}
