'use client';

// @component CandidateDangerZone | @tipo page-component | @versao 2.0.0
// > Zona de perigo — Balha DS v9.1.0
// @api CandidateService — deleteCandidate, useAuth — logout

import React, { useState } from 'react';
import { useNavigate } from '@src/lib/router-compat';
import { useAuth } from '@src/hooks/useAuth';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const CandidateDangerZone: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.toLowerCase() !== 'excluir') {
            error('Digite "excluir" para confirmar.');
            return;
        }

        setIsDeleting(true);
        try {
            // 1. Busca a sessão atual para obter o user_id
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) {
                error('Sessão não encontrada. Faça login novamente.');
                return;
            }

            const userId = session.user.id;

            // 2. Marca o usuário como suspenso na tabela public.users
            const { error: updateError } = await supabase
                .from('users')
                .update({ status: 'suspended' })
                .eq('id', userId);

            if (updateError) throw updateError;

            // 3. Remove registros na tabela candidates (se existirem)
            await supabase
                .from('candidates')
                .delete()
                .eq('user_id', userId);

            success('Solicitação processada. Você tem 30 dias para recuperar sua conta.');
            await logout();
            navigate('/');
        } catch (err: any) {
            error('Erro ao excluir conta. Tente novamente.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 uppercase tracking-widest text-[11px]">
                    <Icon icon="material-symbols:dangerous" className="size-5" />
                    Zona de Perigo
                </h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Gerencie a permanência dos seus dados na plataforma.</p>
            </div>

            <div className="space-y-4 max-w-sm">
                <div className="space-y-0">
                    <p className="text-[11px] text-muted-foreground leading-tight">
                        A exclusão do perfil removerá permanentemente seus dados e histórico de candidaturas.
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                        Seus dados ficarão suspensos e você terá 30 dias para recuperá-los antes da exclusão definitiva.
                    </p>
                </div>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="h-10 px-5 rounded-lg bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-widest hover:bg-destructive hover:text-white transition-all active:scale-95 border border-destructive/20"
                >
                    Excluir minha conta
                </button>
            </div>
        </section>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl p-8 animate-in zoom-in-95 duration-200 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                                    <Icon icon="material-symbols:warning" className="size-7" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground">Excluir conta?</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Seus dados ficarão suspensos. Por até <span className="font-bold text-foreground">30 dias</span> você poderá recuperar sua conta. Após esse período, a exclusão será permanente.
                                </p>
                                <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-widest pt-2">
                                    Digite <span className="text-destructive"> excluir</span> para confirmar
                                </p>
                            </div>
                        </div>

                        <input
                            autoFocus
                            type="text"
                            className="w-full h-11 rounded-lg border border-border bg-background px-4 outline-none text-[11px] font-bold uppercase tracking-widest focus:border-destructive transition-all text-center placeholder:text-muted-foreground/40"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Digite 'excluir' para confirmar"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteConfirmation(''); }}
                                className="h-10 rounded-lg border border-border bg-card text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-muted/30 transition-all active:scale-[0.98]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation.toLowerCase() !== 'excluir' || isDeleting}
                                className="h-10 rounded-lg bg-destructive text-white text-[11px] font-bold uppercase tracking-widest hover:bg-destructive/90 transition-all active:scale-[0.98] disabled:opacity-30"
                            >
                                {isDeleting ? 'Processando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CandidateDangerZone;
