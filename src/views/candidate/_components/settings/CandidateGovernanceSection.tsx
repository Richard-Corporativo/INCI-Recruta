'use client';

// @component CandidateGovernanceSection | @tipo page-component | @versao 2.1.0
// > Governança dados — Balha DS v9.1.0 — Agora usando modais
// @api Modais de Termos e Privacidade

import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { useAuth } from '@src/context/AuthContext';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import TermsModal from '@src/components/public/TermsModal';
import PrivacyPortalModal from '@src/components/public/PrivacyPortalModal';

const CandidateGovernanceSection: React.FC = () => {
    const { user, refreshProfile } = useAuth();
    const { success, error: toastError } = useToast();
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAgreeTerms = async () => {
        setIsLoading(true);
        try {
            // 1. Atualiza nos metadados do Auth (fallback imediato)
            const { error: authError } = await supabase.auth.updateUser({
                data: { 
                    terms_accepted: true,
                    terms_accepted_at: new Date().toISOString()
                }
            });

            if (authError) throw authError;

            // 2. Tenta persistir na tabela pública 'users' se o ID estiver disponível
            if (user?.id) {
                await supabase
                    .from('users')
                    .update({ 
                        terms_accepted: true,
                        terms_accepted_at: new Date().toISOString()
                    })
                    .eq('id', user.id);
            }
            
            await refreshProfile();
            success('Termos de Uso aceitos com sucesso!');
        } catch (err: any) {
            console.error('[Governance] Error accepting terms:', err);
            toastError(err.message || 'Erro ao salvar aceite.');
        } finally {
            setIsLoading(false);
        }
    };

    const isAccepted = user?.terms_accepted === true;

    return (
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-widest text-[11px]">
                    <Icon icon="material-symbols:policy" className="size-5 text-muted-foreground" />
                    Governança de Dados
                </h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Revise as diretrizes de privacidade e termos de uso.</p>
            </div>
            
            <div className="flex flex-col gap-2 items-start max-w-sm">
                <button 
                    onClick={() => setIsPrivacyOpen(true)}
                    className="h-11 px-6 rounded-lg border border-border bg-card text-[11px] font-bold uppercase tracking-widest text-foreground hover:border-primary transition-all group flex items-center justify-between w-full"
                >
                    <span>Política de Privacidade</span>
                    <Icon icon="material-symbols:east" className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </button>

                <button 
                    onClick={() => setIsTermsOpen(true)}
                    className={`h-11 px-6 rounded-lg border transition-all group flex items-center justify-between w-full ${
                        isAccepted 
                        ? 'border-green-500/30 bg-green-500/5 hover:border-green-500' 
                        : 'border-yellow-500/50 bg-yellow-500/5 hover:border-yellow-500'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${
                            isAccepted 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                            Termos de Uso
                        </span>
                        {!isAccepted && (
                            <span className="text-[9px] font-bold bg-yellow-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Pendente</span>
                        )}
                    </div>
                    <Icon icon="material-symbols:east" className={`size-4 transition-all ${
                        isAccepted 
                        ? 'text-green-500 group-hover:translate-x-1' 
                        : 'text-yellow-500 group-hover:translate-x-1'
                    }`} />
                </button>
            </div>

            {/* Modais de Governança */}
            <TermsModal 
                isOpen={isTermsOpen} 
                onClose={() => setIsTermsOpen(false)} 
                type="terms"
                onAgree={handleAgreeTerms} 
            />
            <PrivacyPortalModal 
                isOpen={isPrivacyOpen} 
                onClose={() => setIsPrivacyOpen(false)} 
            />
        </section>
    );
};

export default CandidateGovernanceSection;
