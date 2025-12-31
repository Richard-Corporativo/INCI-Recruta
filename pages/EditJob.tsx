import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';

const EditJob: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);

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
    status: ''
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
        status: job.status
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    updateJob(id, {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      model: formData.model as any,
      contract: formData.contract as any,
      urgency: formData.urgency as any,
      salary_min: Number(formData.salaryMin),
      salary_max: Number(formData.salaryMax),
      context: formData.context,
      status: formData.status as any
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate(`/jobs/${id}`);
    }, 500);
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
        <h2 className="text-2xl font-bold text-foreground">Vaga não encontrada</h2>
        <p className="text-muted-foreground mt-2 mb-6">Não foi possível localizar as informações para esta vaga.</p>
        <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-base font-bold shadow-sm hover:bg-primary/90 transition-all">
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
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Editar Contexto da Vaga</h1>
            <p className="text-muted-foreground text-sm mt-1">Atualize as informações e o contexto estratégico desta oportunidade.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/jobs/${id}`)}
              className="px-4 py-2 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 shadow-sm active:translate-y-[1px]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2 rounded-base text-sm font-bold shadow-sm transition-all duration-200 hover:bg-primary/90 active:translate-y-[1px] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Main Form Card */}
          <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
            <form className="divide-y divide-border" onSubmit={handleSubmit}>
              {/* Section 1: Informações Básicas */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-sm">badge</span>
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Informações Básicas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground" htmlFor="title">Título da Vaga</label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground" htmlFor="department">Departamento</label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="department" name="department" type="text" value={formData.department} onChange={handleInputChange} required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Localização e Contrato */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-muted border border-border text-foreground">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Localização e Contrato</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground" htmlFor="location">Cidade/UF</label>
                    <input
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3"
                      id="location" name="location" type="text" value={formData.location} onChange={handleInputChange} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground" htmlFor="model">Modelo de Trabalho</label>
                    <select
                      className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 h-11 px-3 cursor-pointer"
                      id="model" name="model" value={formData.model} onChange={handleInputChange} required
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Remoto">Remoto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Contexto Estratégico */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-sm">description</span>
                  </span>
                  <h3 className="text-lg font-bold text-foreground">Contexto Estratégico</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground" htmlFor="context">Descrição da Vaga</label>
                  <textarea
                    className="block w-full rounded-base border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 p-3 min-h-[200px] resize-none"
                    id="context" name="context" rows={8} value={formData.context} onChange={handleInputChange} required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditJob;