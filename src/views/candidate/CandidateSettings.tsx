'use client';

// @page CandidateSettings | @tipo page-component | @versao 3.0.0
// > Configurações candidato — Balha DS v9.1.0
// > Reduzido o scroll usando navegação por abas horizontais (UX Conversão)

import React, { useState } from 'react';
import { useCandidateData } from '@src/hooks/useCandidateData';
import ProfileSkeleton from '@src/components/public/ProfileSkeleton';
import { Icon } from "@iconify/react";

import {
    CandidateProfileSection,
    CandidateCommunicationSection,
    CandidateSecuritySection,
    CandidateGovernanceSection,
    CandidateDangerZone
} from './_components/settings';

const CandidateSettings: React.FC = () => {
    const { isLoading } = useCandidateData();
    const [activeTab, setActiveTab] = useState<'profile' | 'communication' | 'security' | 'data'>('profile');

    const tabs = [
        { id: 'profile', label: 'Perfil Profissional', icon: 'material-symbols:person' },
        { id: 'communication', label: 'Notificações', icon: 'material-symbols:notifications' },
        { id: 'security', label: 'Segurança', icon: 'material-symbols:lock' },
        { id: 'data', label: 'Dados e Privacidade', icon: 'material-symbols:shield-person' }
    ] as const;

    return isLoading ? <ProfileSkeleton /> : (
        <div className="w-full max-w-5xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-8 pb-16">

                {/* Header */}
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Portal de Vagas
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Configurações da Conta
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie suas informações, segurança e preferências.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 h-12 px-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap outline-none ${
                                activeTab === tab.id
                                    ? 'border-primary text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            }`}
                        >
                            <Icon icon={tab.icon} className="size-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content — grid 2-col para ProfileSection */}
                <div className="min-h-[400px]">
                    {activeTab === 'profile' && <CandidateProfileSection />}
                    {activeTab === 'communication' && <CandidateCommunicationSection />}
                    {activeTab === 'security' && <CandidateSecuritySection />}
                    {activeTab === 'data' && (
                        <div className="space-y-8">
                            <CandidateGovernanceSection />
                            <CandidateDangerZone />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CandidateSettings;
