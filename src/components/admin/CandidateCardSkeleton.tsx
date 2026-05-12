// @component CandidateCardSkeleton | @tipo componente | @versao 1.0.0
// > Skeleton para CandidateCard

import React from 'react';

const CandidateCardSkeleton = () => {
    return (
        <div className="bg-card p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1">
                    <div className="h-3.5 w-[70%] bg-muted animate-pulse rounded mb-1.5" />
                    <div className="h-2.5 w-[40%] bg-muted animate-pulse rounded" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="h-5 w-[70px] bg-muted animate-pulse rounded" />
                <div className="h-5 w-[50px] bg-muted animate-pulse rounded" />
            </div>
        </div>
    );
};

export default CandidateCardSkeleton;
