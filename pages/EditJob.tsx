import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const EditJob: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock initial data simulation based on ID
  const isDevJob = id === '4092';
  const jobTitle = isDevJob ? 'Dev Frontend Senior' : 'Analista de Marketing Sr.';
  
  const [formData, setFormData] = useState({
    title: jobTitle,
    department: isDevJob ? 'Tecnologia' : 'Marketing',
    team: isDevJob ? 'Squad Fintech' : 'Growth',
    location: 'São Paulo, SP',
    model: isDevJob ? 'Remoto' : 'Híbrido',
    contract: isDevJob ? 'PJ' : 'CLT',
    urgency: isDevJob ? 'Média' : 'Alta',
    salaryMin: isDevJob ? '12000' : '8000',
    salaryMax: isDevJob ? '16000' : '10000',
    description: isDevJob 
      ? 'Estamos buscando um desenvolvedor Frontend sênior com sólida experiência em React, TypeScript e Tailwind para liderar a modernização da nossa plataforma.'
      : 'Profissional responsável por estratégias de growth e performance.',
    status: 'Ativa'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/jobs/${id}`);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Breadcrumbs 
             items={[
               { label: 'Vagas', to: '/jobs' },
               { label: jobTitle, to: `/jobs/${id}` },
               { label: 'Editar' }
             ]} 
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
            Última edição: Há 2 dias por <span className="font-semibold text-slate-700 dark:text-slate-300">Ana Silva</span>
          </span>
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

          {/* Warning Banner */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 shrink-0 mt-0.5">info</span>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Atenção ao editar uma vaga ativa</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                Alterações drásticas nos requisitos ou salário podem impactar os candidatos que já estão em processo. O histórico de alterações será salvo na auditoria.
              </p>
            </div>
          </div>

          {/* Core Info Card */}
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
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Departamento</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                >
                  <option>Tecnologia</option>
                  <option>Marketing</option>
                  <option>Produto</option>
                  <option>Vendas</option>
                  <option>RH</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time / Squad</label>
                <input 
                  type="text" 
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Contract Details Card */}
          <section className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              <h2 className="font-bold text-slate-900 dark:text-white">Detalhes do Contrato</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Modelo de Trabalho</label>
                <select 
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                >
                  <option>Presencial</option>
                  <option>Híbrido</option>
                  <option>Remoto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Contrato</label>
                <select 
                  name="contract"
                  value={formData.contract}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                >
                  <option>CLT</option>
                  <option>PJ</option>
                  <option>Estágio</option>
                  <option>Temporário</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nível de Urgência</label>
                <select 
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Localização</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Faixa Salarial (Mensal)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input 
                      type="number" 
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                    />
                  </div>
                  <span className="text-slate-400">até</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                    <input 
                      type="number" 
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Description Card */}
          <section className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">article</span>
              <h2 className="font-bold text-slate-900 dark:text-white">Descrição e Contexto</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição Resumida (Interna e Externa)</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white resize-y"
                ></textarea>
                <p className="text-xs text-slate-500 dark:text-slate-400">Esta descrição será utilizada nos job boards e na página de carreiras.</p>
              </div>
            </div>
          </section>

        </form>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white dark:bg-[#1a202c] border-t border-slate-200 dark:border-slate-800 p-4 md:px-8 py-4 flex items-center justify-end gap-3 shrink-0 z-20">
        <button 
          type="button"
          onClick={() => navigate(`/jobs/${id}`)}
          className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </footer>
    </div>
  );
};

export default EditJob;