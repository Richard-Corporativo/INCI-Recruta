import React from 'react';
import { Skeleton } from './atoms/Skeleton/Skeleton';

const CandidateCardSkeleton = () => {
    return (
        <div className="bg-card p-3 rounded-lg border border-border shadow-sm space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
                {/* Avatar */}
                <Skeleton type="avatar" width={32} height={32} />

                <div className="flex-1">
                    {/* Name */}
                    <Skeleton type="text" width="70%" height={14} className="mb-1.5" style={{ display: 'block' }} />
                    {/* Time */}
                    <Skeleton type="text" width="40%" height={10} className="mb-0" style={{ display: 'block' }} />
                </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
                <Skeleton type="rect" width={70} height={20} className="rounded" />
                <Skeleton type="rect" width={50} height={20} className="rounded" />
            </div>
        </div>
    );
};

export default CandidateCardSkeleton;
