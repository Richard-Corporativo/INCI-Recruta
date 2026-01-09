import React from 'react';
import { Skeleton } from '../atoms/Skeleton/Skeleton';

const CandidateLayoutSkeleton: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full bg-background transition-colors">
            {/* Desktop Sidebar Skeleton - Hidden on mobile */}
            <aside className="hidden md:flex w-72 flex-col border-r border-border h-screen sticky top-0 bg-sidebar p-6 gap-8">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2">
                    <Skeleton type="rect" width={36} height={36} className="rounded-lg" />
                    <div>
                        <Skeleton type="text" width={100} height={16} />
                        <Skeleton type="text" width={60} height={10} className="mt-1" />
                    </div>
                </div>

                {/* Nav */}
                <div className="flex flex-col gap-2 mt-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} type="rect" width="100%" height={48} className="rounded-lg" />
                    ))}
                </div>

                {/* Footer Logged User */}
                <div className="mt-auto pt-6 border-t border-border">
                    <Skeleton type="rect" width="100%" height={48} className="rounded-lg" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header Skeleton */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                        <Skeleton type="rect" width={32} height={32} className="rounded" />
                        <Skeleton type="text" width={120} height={20} />
                    </div>
                    <Skeleton type="rect" width={32} height={32} className="rounded-full" />
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        {/* BreadCrumb / Header */}
                        <div className="flex flex-col gap-2">
                            <Skeleton type="title" width={250} />
                            <Skeleton type="text" width={400} />
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
                                    <Skeleton type="rect" width={48} height={48} className="rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton type="text" width="60%" />
                                        <Skeleton type="text" width="40%" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateLayoutSkeleton;
