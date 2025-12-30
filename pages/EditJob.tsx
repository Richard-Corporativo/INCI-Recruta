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
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vaga não encontrada</h2>
        <button onClick={() => navigate('/jobs')} className="text-primary hover:underline mt-4 inline-block">Voltar para Vagas</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Breadcrumbs
            items={[
              { label: 'Vagas', to: '/jobs' },
              { label: job.title, to: `/jobs/${id}` },
              { label: 'Editar' }
            ]}
          />
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-24">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Editar Contexto da Vaga <span className="text-slate-400 font-normal ml-2 text-sm">#{id}</span>
            </h1>
          </div>

          <section className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              <h2 className="font-bold text-slate-900 dark:text-white">Informações Principais</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Título da Vaga</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Departamento</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              <h2 className="font-bold text-slate-900 dark:text-white">Detalhes do Contrato</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Modelo de Trabalho</label>
                <select name="model" value={formData.model} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white">
                  <option>Presencial</option>
                  <option>Híbrido</option>
                  <option>Remoto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Contrato</label>
                <select name="contract" value={formData.contract} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white">
                  <option>CLT</option>
                  <option>PJ</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nível de Urgência</label>
                <select name="urgency" value={formData.urgency} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white">
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Localização</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Faixa Salarial</label>
                <div className="flex items-center gap-3">
                  <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white" />
                  <span>até</span>
                  <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">article</span>
              <h2 className="font-bold text-slate-900 dark:text-white">Descrição e Contexto</h2>
            </div>
            <div className="p-6">
              <textarea name="context" value={formData.context} onChange={handleInputChange} rows={6} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white resize-y"></textarea>
            </div>
          </section>
        </form>
      </main>

      <footer className="bg-white dark:bg-[#1a202c] border-t border-slate-200 dark:border-slate-800 p-4 md:px-8 py-4 flex items-center justify-end gap-3 shrink-0 z-20">
        <button onClick={() => navigate(`/jobs/${id}`)} className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
        <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2">
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </footer>
    </div>
  );
};

export default EditJob;