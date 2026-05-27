// @route CompanyJobsListPage | @tipo page | @versao 1.0.0
// > Landing pública por empresa — lista vagas ativas do tenant
// @calls JobsList — componente principal (detecta slug via useParams)

import JobsList from '@src/views/public/JobsList';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <JobsList />
        </Suspense>
    );
}
