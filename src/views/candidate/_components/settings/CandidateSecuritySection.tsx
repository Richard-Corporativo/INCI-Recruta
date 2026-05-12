import React, { useState } from 'react';
import { supabase } from '@src/lib/supabase';
import { useToast } from '@src/components/ui/Toast';
import { Icon } from "@iconify/react";

const CandidateSecuritySection: React.FC = () => {
    const { success, error, warning } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
    const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async () => {
        if (!form.newPass || !form.confirm) {
            warning('Por favor, preencha a nova senha e sua confirmação.');
            return;
        }

        if (form.newPass !== form.confirm) {
            error('As senhas não coincidem.');
            return;
        }

        if (form.newPass.length < 6) {
            error('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setIsSaving(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ 
                password: form.newPass 
            });

            if (updateError) throw updateError;

            success('Senha atualizada com sucesso! Você continuará conectado.');
            setForm({ current: '', newPass: '', confirm: '' });
        } catch (err: any) {
            console.error('Update password error:', err);
            error(err.message || 'Erro ao atualizar senha. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const labelClasses = "text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]";
    const inputWrapper = "relative flex items-center";
    const inputClasses = "w-full h-11 rounded-lg border border-border bg-background px-4 pr-10 outline-none text-[11px] font-bold uppercase tracking-wider text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/30";
    const eyeBtn = "absolute right-2 p-2 text-muted-foreground hover:text-foreground transition-colors outline-none";

    return (
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-widest text-[11px]">
                        <Icon icon="ph:lock-key-fill" className="size-5 text-primary" />
                        Segurança de Acesso
                    </h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Gerencie sua senha e proteja sua conta.</p>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-5 max-w-sm">
                    {/* Senha Atual */}
                    <label className="flex flex-col gap-2">
                        <span className={labelClasses}>Senha Atual</span>
                        <div className={inputWrapper}>
                            <input
                                className={inputClasses}
                                placeholder="••••••••"
                                type={showPass.current ? "text" : "password"}
                                value={form.current}
                                onChange={(e) => handleChange('current', e.target.value)}
                            />
                            <button type="button" onClick={() => toggleVisibility('current')} className={eyeBtn}>
                                <Icon icon={showPass.current ? "ph:eye-slash-bold" : "ph:eye-bold"} className="size-4" />
                            </button>
                        </div>
                    </label>

                    {/* Nova Senha */}
                    <label className="flex flex-col gap-2">
                        <span className={labelClasses}>Nova Senha</span>
                        <div className={inputWrapper}>
                            <input
                                className={inputClasses}
                                placeholder="Mínimo 6 caracteres"
                                type={showPass.new ? "text" : "password"}
                                value={form.newPass}
                                onChange={(e) => handleChange('newPass', e.target.value)}
                            />
                            <button type="button" onClick={() => toggleVisibility('new')} className={eyeBtn}>
                                <Icon icon={showPass.new ? "ph:eye-slash-bold" : "ph:eye-bold"} className="size-4" />
                            </button>
                        </div>
                    </label>

                    {/* Confirmar Nova Senha */}
                    <label className="flex flex-col gap-2">
                        <span className={labelClasses}>Confirmar Nova Senha</span>
                        <div className={inputWrapper}>
                            <input
                                className={inputClasses}
                                placeholder="••••••••"
                                type={showPass.confirm ? "text" : "password"}
                                value={form.confirm}
                                onChange={(e) => handleChange('confirm', e.target.value)}
                            />
                            <button type="button" onClick={() => toggleVisibility('confirm')} className={eyeBtn}>
                                <Icon icon={showPass.confirm ? "ph:eye-slash-bold" : "ph:eye-bold"} className="size-4" />
                            </button>
                        </div>
                    </label>
                </div>

                {/* Footer / Submit */}
                <div className="flex flex-col gap-4 pt-4 border-t border-border">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                        <Icon icon="ph:info-bold" className="size-3.5" />
                        A senha será alterada em todos os dispositivos.
                    </p>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving || !form.newPass || !form.confirm}
                        className="h-10 px-6 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 w-fit"
                    >
                        {isSaving ? (
                            <>
                                <Icon icon="ph:circle-notch-bold" className="size-3.5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Icon icon="ph:check-bold" className="size-3.5" />
                                Atualizar Senha
                            </>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CandidateSecuritySection;
