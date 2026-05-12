// @component JobSummarySkeleton | @tipo componente | @versao 1.0.0
// > Skeleton para resumo de vaga

import React from 'react';
import { Skeleton } from '../atoms/Skeleton/Skeleton';

const JobSummarySkeleton = () => {
    return (
        <div className="rounded-lg bg-card overflow-hidden p-6">
            <div className="p-8">
                <h3 className="text-lg font-semibold flex items-center gap-3 mb-8">
                    <Skeleton type="rect" width={24} height={24} className="rounded" />
                    <Skeleton type="text" width={150} height={20} className="mb-0" />
                </h3>
                <div className="flex flex-col gap-8">
                    {/* Job Title Block */}
                    <div className="flex items-center gap-5">
                        <Skeleton type="rect" width={56} height={56} className="rounded-lg shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                            <Skeleton type="title" width="80%" height={24} className="mb-0" />
                            <Skeleton type="text" width="60%" height={16} className="mb-0" />
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton type="rect" width={18} height={18} className="rounded" />
                                <Skeleton type="text" width={120} height={14} className="mb-0" />
                            </div>
                        ))}
                    </div>

                    {/* Context Box */}
                    <div className="bg-muted/30 p-5 rounded-lg border border-border/50 space-y-2">
                        <Skeleton type="text" width="100%" />
                        <Skeleton type="text" width="90%" />
                        <Skeleton type="text" width="95%" />
                        <Skeleton type="text" width={80} className="mt-4 mb-0" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSummarySkeleton;
