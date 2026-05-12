// @component AdminLayoutSkeleton | @tipo componente | @versao 1.1.0
// > Skeleton de carregamento para layout admin

import React from 'react';

const S = ({ w, h, cls = '' }: { w: number | string; h?: number; cls?: string }) => (
    <div
        className={`bg-muted animate-pulse rounded ${cls}`}
        style={{ width: typeof w === 'number' ? w : w, height: h ?? 16 }}
    />
);

const AdminLayoutSkeleton: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar Skeleton */}
            <aside className="w-16 h-screen bg-card border-r border-border shrink-0 flex flex-col items-center py-6 gap-8">
                <div className="flex items-center justify-center">
                    <S w={40} h={40} cls="rounded-xl" />
                </div>

                <div className="flex flex-col gap-3 items-center w-full">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <S key={i} w={40} h={40} cls="rounded-xl" />
                    ))}
                </div>

                <div className="mt-auto flex flex-col items-center gap-4">
                    <S w={40} h={40} cls="rounded-xl" />
                    <S w={40} h={40} cls="rounded-xl" />
                    <S w={32} h={32} cls="rounded-full" />
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1 p-8 flex flex-col gap-8 h-screen overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <S w={200} h={24} />
                        <S w={300} h={14} />
                    </div>
                    <div className="flex gap-4">
                        <S w={40} h={40} cls="rounded-full" />
                        <S w={120} h={40} cls="rounded-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 rounded-xl bg-card p-6 flex flex-col justify-between">
                            <S w={40} h={40} cls="rounded-lg" />
                            <div className="space-y-2">
                                <S w={80} h={12} />
                                <S w={60} h={20} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 rounded-xl bg-card p-6 space-y-6">
                    <div className="flex justify-between">
                        <S w={150} h={30} cls="rounded-md" />
                        <S w={100} h={30} cls="rounded-md" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <S key={i} w="100%" h={50} cls="rounded-md" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayoutSkeleton;
