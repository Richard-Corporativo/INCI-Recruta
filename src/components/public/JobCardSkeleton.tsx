// @component JobCardSkeleton | @tipo componente | @versao 1.0.0
// > Skeleton para JobCardPublic

import React from 'react';
import { Skeleton } from '../atoms/Skeleton/Skeleton';

const JobCardSkeleton = () => {
    return (
        <article className="relative bg-card border-2 border-border p-10 rounded-[40px] flex flex-col md:flex-row gap-10 items-start md:items-center animate-pulse">
            <div className="flex-1 space-y-8">
                {/* Badges Skeleton */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="h-8 w-24 bg-muted/10 border-2 border-border rounded-xl" />
                    <div className="h-8 w-32 bg-muted/10 border-2 border-border rounded-xl" />
                </div>

                <div className="space-y-4">
                    {/* Title Skeleton */}
                    <div className="h-12 w-3/4 bg-muted/20 border-2 border-border rounded-2xl" />
                    
                    {/* Meta Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-muted/10 border-2 border-border rounded-xl" />
                            <div className="h-4 w-24 bg-muted/5 rounded-full" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-muted/10 border-2 border-border rounded-xl" />
                            <div className="h-4 w-20 bg-muted/5 rounded-full" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-muted/10 border-2 border-border rounded-xl" />
                            <div className="h-4 w-16 bg-muted/5 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-3">
                    <div className="h-6 w-16 bg-muted/5 border-2 border-border/40 rounded-lg" />
                    <div className="h-6 w-20 bg-muted/5 border-2 border-border/40 rounded-lg" />
                    <div className="h-6 w-14 bg-muted/5 border-2 border-border/40 rounded-lg" />
                </div>
            </div>

            {/* Actions Area Skeleton */}
            <div className="flex flex-col w-full md:w-auto gap-4 pt-8 md:pt-0 border-t-4 md:border-t-0 md:border-l-4 border-muted/20 md:pl-12">
                <div className="w-full md:w-56 h-16 bg-muted/10 border-2 border-border rounded-[24px]" />
                <div className="w-full md:w-56 h-16 bg-muted/5 border-2 border-border rounded-[24px]" />
            </div>
        </article>
    );
};

export default JobCardSkeleton;
