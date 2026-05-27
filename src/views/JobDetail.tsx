'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useJobs } from '@src/hooks/useJobs';
import { useUsers } from '@src/hooks/useUsers';
import { useAuth } from '@src/context/AuthContext';
import { JobDetailHeader, JobDetailSidebar, JobDetailSpec, JobDetailHistory } from './_components/job-detail';

const JobDetail: React.FC = () => {
    const params = useParams();
    const { jobs, transitionJobStatus } = useJobs();
    const { users } = useUsers();
    const { user } = useAuth();
    const job = jobs.find(j => String(j.id) === String(params?.id));
    const manager = users.find(u => u.id === job?.manager_id);

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>Carregando detalhes da vaga...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background transition-colors duration-200">
            <JobDetailHeader 
                job={job} 
                user={user} 
                transitionJobStatus={transitionJobStatus} 
                onArchiveClick={() => {}} 
            />
            <div className="flex-1 flex overflow-hidden p-4 lg:p-8 gap-8">
                <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                    <JobDetailSpec job={job} />
                    <JobDetailHistory jobLogs={[]} onSelectLog={() => {}} />
                </div>
                <JobDetailSidebar 
                    job={job} 
                    manager={manager}
                    canViewSalaries={user?.role === 'admin' || user?.role === 'quality'}
                    forecast={null}
                />
            </div>
        </div>
    );
};

export default JobDetail;
