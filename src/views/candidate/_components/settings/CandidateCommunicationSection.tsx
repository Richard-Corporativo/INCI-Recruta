'use client';

// @component CandidateCommunicationSection | @tipo page-component | @versao 2.0.0
// > Comunicação candidato — Balha DS v9.1.0
// @api useCandidateData — update prefs, useToast — feedback

import React, { useState, useEffect } from 'react';
import { useCandidateData } from '@src/hooks/useCandidateData';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const CandidateCommunicationSection: React.FC = () => {
    const { currentCandidate, updateProfile } = useCandidateData();
    const { success, error } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        whatsapp: true
    });

    useEffect(() => {
        if (currentCandidate && currentCandidate.notification_preferences) {
            setNotifications(currentCandidate.notification_preferences as any);
        }
    }, [currentCandidate]);

    const handleSavePreferences = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                notification_preferences: notifications
            } as any);
            success('Preferências de notificação salvas!');
        } catch (err: any) {
            error('Erro ao salvar: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const channels = [
        { id: 'email', label: 'E-mail', desc: 'Alertas de status e novas vagas', icon: 'mail' },
        { id: 'sms', label: 'SMS', desc: 'Alertas críticos e urgentes', icon: 'sms' },
        { id: 'whatsapp', label: 'WhatsApp', desc: 'Contato direto com recrutadores', icon: 'chat' }
    ];

    return (
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Icon icon="material-symbols:notifications-active" className="size-5 text-muted-foreground" />
                    Canais de Comunicação
                </h3>
                <p className="text-[11px] text-muted-foreground">Gerencie como você recebe notificações sobre seus processos.</p>
            </div>

            <div className="flex flex-col gap-2 max-w-xl">
                {channels.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-all bg-card/50">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                                <Icon icon={`material-symbols:${item.icon}`} className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">{item.label}</p>
                                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications({ ...notifications, [item.id]: !(notifications as any)[item.id] })}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${(notifications as any)[item.id] ? 'bg-primary' : 'bg-muted border border-border'}`}
                            role="switch"
                            aria-checked={(notifications as any)[item.id]}
                            aria-label={`${item.label} notifications`}
                        >
                            <span className={`pointer-events-none inline-block size-3.5 transform rounded-full bg-white transition duration-200 ${(notifications as any)[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                ))}

                <div className="flex justify-start pt-4">
                    <button
                        onClick={handleSavePreferences}
                        disabled={isSaving}
                        className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CandidateCommunicationSection;
