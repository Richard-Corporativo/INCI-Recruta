'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCandidateData } from '@src/hooks/useCandidateData';
import { useToast } from '@src/components/ui/Toast';
import { CandidateService } from '@src/services/candidate.service';
import SkillsSelector from '@src/components/shared/SkillsSelector';
import ExperienceListEditor from '@src/components/shared/ExperienceListEditor';
import EducationListEditor from '@src/components/shared/EducationListEditor';
import LanguagesSelector from '@src/components/shared/LanguagesSelector';
import CustomSelect from '@src/components/ui/CustomSelect';
import { Experience, Education } from '@src/types';
import { Icon } from "@iconify/react";

const CandidateProfileSection: React.FC = () => {
    const { currentCandidate, updateProfile } = useCandidateData();
    const { success, error } = useToast();
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleAccordion = (section: string) => {
        setOpenAccordion(prev => prev === section ? null : section);
    };

    const [pessoais, setPessoais] = useState({ name: '', role: '', phone: '', location: '', pretension_min: '', pretension_max: '', availability: '', desired_work_model: '' });
    const [summary, setSummary] = useState('');
    const [education, setEducation] = useState<Education[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [links, setLinks] = useState({ linkedin: '', github: '', portfolio: '', resume_name: '' });
    const [diversity, setDiversity] = useState<{ gender?: string; race?: string; isPcd?: boolean }>({});

    useEffect(() => {
        if (currentCandidate) {
            setPessoais({
                name: currentCandidate.name || '',
                role: currentCandidate.role || 'Candidato',
                phone: currentCandidate.phone || '',
                location: currentCandidate.location || '',
                pretension_min: currentCandidate.pretension_min?.toString() || '',
                pretension_max: currentCandidate.pretension_max?.toString() || '',
                availability: currentCandidate.availability || '',
                desired_work_model: currentCandidate.desired_work_model || ''
            });
            setSummary(currentCandidate.summary || '');
            setEducation(currentCandidate.education || []);
            setExperience(currentCandidate.experience || []);
            setSkills(currentCandidate.skills || []);
            setLanguages(currentCandidate.languages || []);
            setLinks({
                linkedin: currentCandidate.linkedin || '',
                github: currentCandidate.github || '',
                portfolio: currentCandidate.portfolio || '',
                resume_name: currentCandidate.resumeName || currentCandidate.resume_name || ''
            });
            if (currentCandidate.id) {
                CandidateService.getDiversityData(currentCandidate.id).then(d => {
                    if (d) setDiversity(d);
                });
            }
        }
    }, [currentCandidate]);

    const saveCard = async (cardId: string, data: any) => {
        setIsSaving(cardId);
        try {
            await updateProfile(data);
            success('Salvo com sucesso.');
        } catch (err: any) {
            error(err.message || 'Erro ao salvar.');
        } finally {
            setIsSaving(null);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentCandidate?.id) return;
        if (file.type !== 'application/pdf') { error('Envie apenas arquivos PDF.'); return; }
        if (file.size > 5 * 1024 * 1024) { error('O arquivo deve ter no máximo 5MB.'); return; }

        setIsSaving('links');
        try {
            const successUpload = await CandidateService.uploadResume(file, currentCandidate.id);
            if (!successUpload) throw new Error('Falha no upload');
            setLinks(prev => ({ ...prev, resume_name: file.name }));
            await updateProfile({ resumeName: file.name, has_resume: true });
            success('Currículo salvo com sucesso.');
        } catch { error('Erro ao enviar currículo.'); }
        finally { setIsSaving(null); }
    };

    const handleDownloadResume = async () => {
        if (!currentCandidate?.id) return;
        try {
            const result = await CandidateService.downloadResume(currentCandidate.id);
            if (result) {
                const url = URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = url; a.download = result.fileName;
                document.body.appendChild(a); a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else error('Currículo não encontrado.');
        } catch { error('Erro ao baixar currículo.'); }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentCandidate?.id) return;
        if (!file.type.startsWith('image/')) { error('Envie apenas arquivos de imagem.'); return; }
        if (file.size > 2 * 1024 * 1024) { error('A imagem deve ter no máximo 2MB.'); return; }

        setIsSaving('pessoais');
        try {
            const publicUrl = await CandidateService.uploadAvatar(file, currentCandidate.id);
            if (publicUrl) {
                await updateProfile({ avatar: publicUrl });
                success('Foto de perfil atualizada.');
            }
        } catch { error('Erro ao enviar foto.'); }
        finally {
            setIsSaving(null);
            if (e.target) e.target.value = '';
        }
    };

    const labelClasses = "text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]";
    const inputClasses = "w-full h-11 rounded-lg border border-border bg-background px-4 outline-none text-[11px] font-bold uppercase tracking-wider text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/30";
    const accordionBtn = "w-full flex items-center justify-between text-left py-4 px-6 hover:bg-muted/20 transition-colors rounded-lg group";
    const saveBtn = "h-10 px-5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0";
    const sectionContent = "px-6 pb-6";

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden" role="list">
            {/* Identity — sempre visível */}
            <div className="p-6 flex flex-col md:flex-row items-center gap-6 border-b border-border bg-muted/5">
                <div className="size-24 rounded-2xl bg-cover bg-center shrink-0 border border-border bg-muted flex items-center justify-center text-muted-foreground relative group overflow-hidden" style={currentCandidate?.avatar ? { backgroundImage: `url("${currentCandidate.avatar}")` } : {}}>
                    {!currentCandidate?.avatar && <Icon icon="material-symbols:person" className="size-10" />}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Icon icon="material-symbols:photo-camera" className="size-6 text-white" />
                        <input accept="image/*" className="hidden" type="file" onChange={handleAvatarUpload} />
                    </label>
                </div>
                <div className="flex flex-col gap-3 flex-1 w-full text-center md:text-left">
                    <div className="space-y-1">
                        <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest text-[11px]">Foto de Perfil</h2>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Identidade visual do seu perfil profissional.</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">JPG, PNG. Máx. 2MB.</p>
                        {isSaving === 'pessoais' && <Icon icon="ph:circle-notch-bold" className="size-4 animate-spin text-primary" />}
                    </div>
                </div>
            </div>

            {/* Accordion sections */}
            <div className="divide-y divide-border">
                {/* 1. Dados Pessoais */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('dados')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="material-symbols:contact-page" className="size-4 text-muted-foreground" />
                            Dados Pessoais
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'dados' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'dados' && (
                        <div className={sectionContent}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                {[
                                    { label: 'Nome Completo', name: 'name', type: 'text' },
                                    { label: 'Cargo Atual', name: 'role', type: 'text' },
                                    { label: 'Telefone', name: 'phone', type: 'text' },
                                    { label: 'Cidade, UF', name: 'location', type: 'text' },
                                    { label: 'Pretensão Mínima', name: 'pretension_min', type: 'number' },
                                    { label: 'Pretensão Máxima', name: 'pretension_max', type: 'number' },
                                ].map((f) => (
                                    <label key={f.name} className="flex flex-col gap-1.5">
                                        <span className={labelClasses}>{f.label}</span>
                                        <input className={inputClasses} type={f.type} value={(pessoais as any)[f.name]} onChange={e => setPessoais(p => ({ ...p, [f.name]: e.target.value }))} />
                                    </label>
                                ))}
                                <label className="flex flex-col gap-1.5">
                                    <span className={labelClasses}>Disponibilidade</span>
                                    <CustomSelect
                                        value={pessoais.availability}
                                        onChange={v => setPessoais(p => ({ ...p, availability: v }))}
                                        options={["Imediata", "15 dias", "30 dias", "A combinar"]}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className={labelClasses}>Modalidade Desejada</span>
                                    <CustomSelect
                                        value={pessoais.desired_work_model}
                                        onChange={v => setPessoais(p => ({ ...p, desired_work_model: v }))}
                                        options={["Presencial", "Híbrido", "Remoto"]}
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => saveCard('pessoais', {
                                    name: pessoais.name, role: pessoais.role, phone: pessoais.phone,
                                    location: pessoais.location,
                                    pretension_min: pessoais.pretension_min ? Number(pessoais.pretension_min) : undefined,
                                    pretension_max: pessoais.pretension_max ? Number(pessoais.pretension_max) : undefined,
                                    availability: pessoais.availability,
                                    desired_work_model: pessoais.desired_work_model || undefined
                                })} disabled={isSaving === 'pessoais'} className={saveBtn}>
                                    {isSaving === 'pessoais' ? 'Salvando...' : 'Salvar Dados'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Resumo Profissional */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('resumo')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="material-symbols:history-edu" className="size-4 text-muted-foreground" />
                            Resumo Profissional
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'resumo' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'resumo' && (
                        <div className={sectionContent}>
                            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={4}
                                className="w-full rounded-lg border border-border bg-background p-4 outline-none text-[11px] font-bold uppercase tracking-wider text-foreground focus:border-primary transition-all resize-none placeholder:text-muted-foreground/30 mb-4"
                                placeholder="Descreva sua trajetória..." />
                            <div className="flex justify-end">
                                <button onClick={() => saveCard('summary', { summary })} disabled={isSaving === 'summary'} className={saveBtn}>
                                    {isSaving === 'summary' ? 'Salvando...' : 'Salvar Resumo'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Formação */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('formacao')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="material-symbols:school" className="size-4 text-muted-foreground" />
                            Formação Acadêmica
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'formacao' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'formacao' && (
                        <div className={sectionContent}>
                            <div className="bg-muted/5 rounded-xl border border-border p-4 mb-4">
                                <EducationListEditor 
                                    educationList={education} 
                                    onChange={(newList) => {
                                        setEducation(newList);
                                        saveCard('education', { education: newList });
                                    }} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Experiência */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('experiencia')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="material-symbols:work-history" className="size-4 text-muted-foreground" />
                            Experiência Profissional
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'experiencia' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'experiencia' && (
                        <div className={sectionContent}>
                            <div className="bg-muted/5 rounded-xl border border-border p-4 mb-4">
                                <ExperienceListEditor 
                                    experiences={experience} 
                                    onChange={(newList) => {
                                        setExperience(newList);
                                        saveCard('experience', { experience: newList });
                                    }} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Habilidades */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('skills')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="ph:brain-fill" className="size-4 text-muted-foreground" />
                            Habilidades e Idiomas
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'skills' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'skills' && (
                        <div className={sectionContent}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <SkillsSelector 
                                    selectedSkills={skills} 
                                    onChange={(newSkills) => {
                                        setSkills(newSkills);
                                        saveCard('skills', { skills: newSkills, languages });
                                    }} 
                                />
                                <LanguagesSelector 
                                    selectedLanguages={languages} 
                                    onChange={(newLangs) => {
                                        setLanguages(newLangs);
                                        saveCard('skills', { skills, languages: newLangs });
                                    }} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 6. Links */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('links')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="material-symbols:link" className="size-4 text-muted-foreground" />
                            Links e Anexos
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'links' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'links' && (
                        <div className={sectionContent}>
                            <div className="flex flex-col gap-4 mb-4">
                                {[
                                    { label: 'LinkedIn', name: 'linkedin' as const },
                                    { label: 'GitHub', name: 'github' as const },
                                    { label: 'Portfólio', name: 'portfolio' as const }
                                ].map((link) => (
                                    <label key={link.name} className="flex flex-col gap-1.5">
                                        <span className={labelClasses}>{link.label}</span>
                                        <input className={inputClasses} type="url" value={links[link.name]}
                                            onChange={e => setLinks(p => ({ ...p, [link.name]: e.target.value }))}
                                            placeholder={`https://${link.name.toLowerCase()}.com/...`} />
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <h4 className="text-xs font-semibold text-foreground">Currículo</h4>
                                {links.resume_name && (
                                    <div className="flex items-center justify-between p-3 bg-muted/10 border border-border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                                                <Icon icon="material-symbols:picture-as-pdf" className="size-4" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-foreground truncate block max-w-[200px]">{links.resume_name}</span>
                                                <button type="button" onClick={handleDownloadResume} className="text-[10px] font-semibold text-primary hover:underline underline-offset-2">Baixar</button>
                                            </div>
                                        </div>
                                        <Icon icon="material-symbols:check-circle" className="size-5 text-success" />
                                    </div>
                                )}
                                <label className="cursor-pointer border-2 border-dashed border-border p-5 rounded-xl bg-card hover:border-primary transition-all flex flex-col items-center gap-2">
                                    <input accept=".pdf" className="hidden" type="file" onChange={handleResumeUpload} ref={fileInputRef} />
                                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                                        <Icon icon="material-symbols:upload-file" className="size-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">Enviar Currículo</p>
                                    <p className="text-[10px] text-muted-foreground">PDF, máx. 5MB</p>
                                </label>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button onClick={() => saveCard('links', {
                                    linkedin: links.linkedin, github: links.github, portfolio: links.portfolio
                                })} disabled={isSaving === 'links'} className={saveBtn}>
                                    {isSaving === 'links' ? 'Salvando...' : 'Salvar Links'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 7. Diversidade */}
                <div role="listitem">
                    <button type="button" onClick={() => toggleAccordion('diversidade')} className={accordionBtn}>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                            <Icon icon="material-symbols:diversity-3" className="size-4 text-muted-foreground" />
                            Diversidade
                        </h3>
                        <Icon icon="material-symbols:chevron-right" className={`size-5 text-muted-foreground transition-transform duration-200 ${openAccordion === 'diversidade' ? 'rotate-90' : ''}`} />
                    </button>
                    {openAccordion === 'diversidade' && (
                        <div className={sectionContent}>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-6">Inclusão e pertencimento (Opcional)</p>

                            {/* Gênero */}
                            <div className="space-y-3 mb-6">
                                <label className={labelClasses}>Identidade de Gênero</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {[
                                        { id: 'female', label: 'Feminino', icon: 'material-symbols:woman' },
                                        { id: 'male', label: 'Masculino', icon: 'material-symbols:man' },
                                        { id: 'non_binary', label: 'Não Binário', icon: 'material-symbols:transgender' },
                                        { id: 'other', label: 'Outro', icon: 'material-symbols:person-outline' },
                                        { id: 'prefer_not_to_say', label: 'Não Informar', icon: 'material-symbols:block' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setDiversity(prev => ({ ...prev, gender: prev.gender === opt.id ? undefined : opt.id }))}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ease-in-out text-left ${
                                                diversity.gender === opt.id
                                                ? 'bg-primary/5 border-primary text-primary'
                                                : 'bg-muted/5 border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                                            }`}
                                        >
                                            <Icon icon={opt.icon} className="size-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Raça */}
                            <div className="space-y-3 mb-6">
                                <label className={labelClasses}>Raça / Cor</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {[
                                        { id: 'white', label: 'Branca' },
                                        { id: 'black', label: 'Preta' },
                                        { id: 'brown', label: 'Parda' },
                                        { id: 'yellow', label: 'Amarela' },
                                        { id: 'indigenous', label: 'Indígena' },
                                        { id: 'prefer_not_to_say', label: 'Não Informar', icon: 'material-symbols:block' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setDiversity(prev => ({ ...prev, race: prev.race === opt.id ? undefined : opt.id }))}
                                            className={`flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ease-in-out ${
                                                diversity.race === opt.id
                                                ? 'bg-primary/5 border-primary text-primary'
                                                : 'bg-muted/5 border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                                            } ${opt.icon ? '' : 'text-center'}`}
                                        >
                                            {opt.icon && <Icon icon={opt.icon} className="size-4" />}
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PCD */}
                            <div className="mb-6">
                                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-muted/5 cursor-pointer hover:border-primary/30 transition-all duration-200 ease-in-out">
                                    <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                                        diversity.isPcd ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/50'
                                    }`}>
                                        {diversity.isPcd && <Icon icon="material-symbols:check" className="size-4" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={!!diversity.isPcd} onChange={() => setDiversity(prev => ({ ...prev, isPcd: !prev.isPcd }))} />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-foreground uppercase tracking-widest">Pessoa com Deficiência (PCD)</span>
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Ações afirmativas e acessibilidade</span>
                                    </div>
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    disabled={isSaving === 'diversidade'}
                                    onClick={async () => {
                                        if (!currentCandidate?.id) return;
                                        setIsSaving('diversidade');
                                        try {
                                            await CandidateService.saveDiversityData(currentCandidate.id, diversity);
                                            success('Salvo com sucesso.');
                                        } catch (err: any) {
                                            error(err.message || 'Erro ao salvar.');
                                        } finally {
                                            setIsSaving(null);
                                        }
                                    }}
                                    className={saveBtn}
                                >
                                    {isSaving === 'diversidade' ? <Icon icon="ph:circle-notch-bold" className="size-4 animate-spin" /> : null}
                                    Salvar Diversidade
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileSection;
