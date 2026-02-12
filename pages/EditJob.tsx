import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import DynamicListInput from '../components/DynamicListInput';
import BenefitsSelector from '../components/BenefitsSelector';
import RequirementsSelector from '../components/RequirementsSelector';
import { JOB_BENEFITS_OPTIONS } from '../constants';
import Toast from '../components/Toast';
import SLAConfig from '../components/SLAConfig';

const EditJob: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ messaged: string; type: 'success' | 'error' } | null>(null);

  const job = jobs.find(j => j.id.toString() === id);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    model: '',
    contract: '',
    urgency: '',
    salaryMin: '',
    salaryMax: '',
    context: '',
    requirements: [] as string[],
    benefits: [] as string[],
    status: '',
    registrationDeadline: '',
    slaSettings: {} as Record<string, { days: number }>
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        model: job.model,
        contract: job.contract,
        urgency: job.urgency,
        salaryMin: job.salary_min.toString(),
        salaryMax: job.salary_max.toString(),
        context: job.context,
        requirements: typeof job.requirements === 'string' ? job.requirements.split('\n').filter(r => r.trim() !== '') : (Array.isArray(job.requirements) ? job.requirements : []),
        benefits: job.benefits || [],
        status: job.status,
        registrationDeadline: job.registration_deadline || '',
        slaSettings: job.sla_settings || {}
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    try {
      await updateJob(id, {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        model: formData.model as any,
        contract: formData.contract as any,
        urgency: formData.urgency as any,
        salary_min: Number(formData.salaryMin),
        salary_max: Number(formData.salaryMax),
        context: formData.context,
        requirements: formData.requirements.join('\n'),
        benefits: formData.benefits,
        status: formData.status as any,
        registration_deadline: formData.registrationDeadline || null,
        sla_settings: formData.slaSettings
      });

      setToast({ message: 'Vaga atualizada com sucesso!', type: 'success' });

      setTimeout(() => {
        setIsLoading(false);
        navigate(`/jobs/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating job:', error);
      setToast({ message: 'Erro ao atualizar vaga. Tente novamente.', type: 'error' });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
        <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Vaga não encontrada</h2>
        <p className="text-muted-foreground mt-2 mb-6">Não foi possível localizar as informações para esta vaga.</p>
        <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-base font-semibold shadow-sm hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Voltar para Vagas
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
        <div className="mb-3">
          <Breadcrumbs
            items={[
              { label: 'Vagas', to: '/jobs' },
              { label: job.title, to: `/jobs/${id}` },
              { label: 'Editar' }
            ]}
          />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Editar Contexto da Vaga</h1>
            <p className="text-muted-foreground text-sm mt-1">Atualize as informações e o contexto estratégico desta oportunidade.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/jobs/${id}`)}
              className="px-4 py-2 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 shadow-sm active:translate-y-[1px]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-base text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-primary/90 active:translate-y-[1px] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-8 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto pb-24">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Left Column: Fixed Content Info */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden h-fit sticky top-24 transition-colors">
                <div className="p-4 bg-muted/20 border-b border-border transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                    <h2 className="text-foreground font-semibold text-base transition-colors">Informações do Cargo</h2>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-md p-3 flex gap-3 items-start transition-colors">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">help_outline</span>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                      Algumas informações são herdadas do cargo e servem de base para esta vaga.
                    </p>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Título (Para referência)</span>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Departamento</span>
                    <div className="bg-muted px-3 py-2.5 rounded-md text-sm font-medium text-foreground">
                      {formData.department}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status da Vaga</span>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Pausada">Pausada</option>
                      <option value="Encerrada">Encerrada</option>
                      <option value="Rascunho">Rascunho</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-border mt-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Faixa Salarial (R$)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">MIN</span>
                        <input
                          type="number"
                          name="salaryMin"
                          value={formData.salaryMin}
                          onChange={handleInputChange}
                          className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none"
                          placeholder="Ex: 1500"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">MAX</span>
                        <input
                          type="number"
                          name="salaryMax"
                          value={formData.salaryMax}
                          onChange={handleInputChange}
                          className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-background text-sm font-mono focus:ring-1 focus:ring-primary outline-none"
                          placeholder="Ex: 3000"
                        />
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-2 italic font-medium">Insira o valor cheio sem pontos ou vírgulas (Ex: 1500).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editable Context */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-card border border-border shadow-sm p-8 relative rounded-lg transition-colors">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary rounded-t-lg"></div>
                <div className="mb-8">
                  <h2 className="text-foreground font-semibold text-2xl transition-colors">Contexto da vaga</h2>
                  <p className="text-sm text-muted-foreground font-medium transition-colors">Personalize os detalhes desta abertura específica.</p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Modelo de trabalho <span className="text-destructive">*</span></label>
                      <select name="model" value={formData.model} onChange={handleInputChange} className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring">
                        <option>Híbrido</option>
                        <option>Presencial</option>
                        <option>Remoto</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Tipo de contrato <span className="text-destructive">*</span></label>
                      <select name="contract" value={formData.contract} onChange={handleInputChange} className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring">
                        <option value="CLT">CLT (Efetivo)</option>
                        <option value="PJ">Pessoa Jurídica (PJ)</option>
                        <option value="Estágio">Estágio</option>
                        <option value="Temporário">Temporário</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Período de inscrição</label>
                      <input
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleInputChange}
                        className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                        type="date"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-muted-foreground transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                        Localidade do escritório <span className="text-destructive">*</span>
                      </label>
                      <select name="location" value={formData.location} onChange={handleInputChange} className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring">
                        <option>Juazeiro do Norte - CE</option>
                        <option>Barbalha - CE</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-lg border border-border transition-colors">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Nível de urgência</label>
                      <div className="flex h-10 p-1 bg-background border border-border rounded-md transition-colors">
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, urgency: 'Baixa' }))} className={`flex-1 text-[10px] font-semibold rounded transition-all duration-200 ease-in-out ${formData.urgency === 'Baixa' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>Baixa</button>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, urgency: 'Média' }))} className={`flex-1 text-[10px] font-semibold rounded transition-all duration-200 ease-in-out ${formData.urgency === 'Média' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>Média</button>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, urgency: 'Alta' }))} className={`flex-1 text-[10px] font-semibold rounded transition-all duration-200 ease-in-out ${formData.urgency === 'Alta' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>Alta</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold text-muted-foreground transition-colors">
                      Contexto do projeto / motivo da vaga <span className="text-destructive">*</span>
                    </label>
                    <textarea name="context" value={formData.context} onChange={handleInputChange} className="w-full h-32 rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium resize-none hover:border-ring placeholder:text-muted-foreground" placeholder="Explique por que essa vaga existe agora..."></textarea>
                  </div>

                  <div className="flex flex-col gap-2">
                    <RequirementsSelector
                      selectedRequirements={formData.requirements}
                      onChange={(items) => setFormData(prev => ({ ...prev, requirements: items }))}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <SLAConfig
                      settings={formData.slaSettings}
                      onChange={(settings) => setFormData(prev => ({ ...prev, slaSettings: settings }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <BenefitsSelector
                      selectedBenefits={formData.benefits}
                      onChange={(items) => setFormData(prev => ({ ...prev, benefits: items }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EditJob;
