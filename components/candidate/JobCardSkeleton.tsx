import React from 'react';
import { Skeleton } from '../atoms/Skeleton/Skeleton';

const JobCardSkeleton = () => {
    return (
        <article className="flex flex-col md:flex-row gap-8 p-8 bg-card rounded-lg border border-border shadow-sm">
            {/* Left Column */}
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-2">
                    {/* Tags/Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Skeleton type="rect" width={60} height={24} className="rounded-md" />
                        <Skeleton type="rect" width={80} height={24} className="rounded-md" />
                    </div>

                    {/* Title */}
                    <Skeleton type="title" width="60%" height={32} className="mb-0" />
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <div className="flex items-center gap-2">
                        <Skeleton type="avatar" width={20} height={20} />
                        <Skeleton type="text" width={100} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton type="avatar" width={20} height={20} />
                        <Skeleton type="text" width={80} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton type="avatar" width={20} height={20} />
                        <Skeleton type="text" width={60} />
                    </div>
                </div>

                {/* Bottom Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Skeleton type="rect" width={80} height={24} className="rounded-md" />
                    <Skeleton type="rect" width={100} height={24} className="rounded-md" />
                    <Skeleton type="rect" width={70} height={24} className="rounded-md" />
                </div>
            </div>

            {/* Actions Area */}
            <div className="flex md:flex-col gap-4 min-w-[180px] pt-6 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-border md:justify-center">
                <Skeleton type="rect" width="100%" height={48} className="rounded-base" />
                <Skeleton type="rect" width="100%" height={48} className="rounded-base" />
            </div>
        </article>
    );
};

export default JobCardSkeleton;
