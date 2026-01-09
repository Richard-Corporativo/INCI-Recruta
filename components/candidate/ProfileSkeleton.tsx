import React from 'react';
import { Skeleton } from '../atoms/Skeleton/Skeleton';

const ProfileSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto w-full px-4 md:px-10 lg:px-14 py-8 md:py-12 flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Skeleton type="title" width={300} height={32} />
                <Skeleton type="text" width={400} />
            </div>

            {/* Form Skeleton */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Avatar Section */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border-b border-border">
                    <Skeleton type="rect" width={128} height={128} className="rounded-3xl shrink-0" />
                    <div className="flex flex-col gap-4 flex-1 w-full">
                        <Skeleton type="text" width={100} />
                        <Skeleton type="rect" width="100%" height={48} className="rounded-full" />
                        <Skeleton type="text" width={250} />
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-8 md:p-12 space-y-10 border-b border-border">
                    <Skeleton type="title" width={200} height={24} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex flex-col gap-2.5">
                                <Skeleton type="text" width={100} />
                                <Skeleton type="rect" width="100%" height={48} className="rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Textarea Section */}
                <div className="p-8 md:p-12 space-y-8">
                    <Skeleton type="title" width={200} height={24} />
                    <Skeleton type="rect" width="100%" height={150} className="rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
