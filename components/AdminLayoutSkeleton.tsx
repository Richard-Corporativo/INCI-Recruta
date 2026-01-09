import React from 'react';
import { Skeleton } from './atoms/Skeleton/Skeleton';

const AdminLayoutSkeleton: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar Skeleton */}
            <aside className="w-64 h-screen bg-card border-r border-border shrink-0 flex flex-col p-6 gap-8">
                {/* Logo Area */}
                <div className="flex items-center gap-3 px-2">
                    <Skeleton type="rect" width={32} height={32} className="rounded-lg" />
                    <Skeleton type="text" width={120} height={20} />
                </div>

                {/* Nav Items */}
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} type="rect" width="100%" height={40} className="rounded-md" />
                    ))}
                </div>

                {/* Bottom Profile */}
                <div className="mt-auto pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Skeleton type="avatar" width={36} height={36} />
                        <div className="flex flex-col gap-1">
                            <Skeleton type="text" width={100} height={14} />
                            <Skeleton type="text" width={60} height={10} />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1 p-8 flex flex-col gap-8 h-screen overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <Skeleton type="title" width={200} />
                        <Skeleton type="text" width={300} />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton type="rect" width={40} height={40} className="rounded-full" />
                        <Skeleton type="rect" width={120} height={40} className="rounded-lg" />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
                            <Skeleton type="rect" width={40} height={40} className="rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton type="text" width={80} />
                                <Skeleton type="title" width={60} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Big Table/Section */}
                <div className="flex-1 rounded-xl border border-border bg-card p-6 space-y-6">
                    <div className="flex justify-between">
                        <Skeleton type="rect" width={150} height={30} className="rounded-md" />
                        <Skeleton type="rect" width={100} height={30} className="rounded-md" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} type="rect" width="100%" height={50} className="rounded-md" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayoutSkeleton;
