import React from 'react';
import { Skeleton } from '../atoms/Skeleton/Skeleton';

const ApplicationCardSkeleton = () => {
    return (
        <div className="bg-card rounded-lg p-6 lg:p-8 border border-border flex gap-8">
            <Skeleton className="size-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-col sm:flex-row justify-between items-end pt-4 gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-11 w-40 rounded-base" />
                </div>
            </div>
        </div>
    );
};

export default ApplicationCardSkeleton;
