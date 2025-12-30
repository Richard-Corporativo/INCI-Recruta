import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRoles } from '../hooks/useRoles';

const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const { addRole } = useRoles();

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    department: '',
    area: '',
    seniority: 'Pleno',
    mission: '',
    responsibilities: '',
    status: 'Ativo'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRole({
      ...formData,
      open_positions: 0
    });
    navigate('/roles');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined">work</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">RecruitSys</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 border-2 border-surface-light dark:border-surface-dark"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-gray-700 cursor-pointer" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHemBeAS1_woVCKvfyKNKA11T3w8U0CycW6Q1l1BlAO4jNXRFGf5eQP4nmZ7S1MoyeuX9ZWyxzFFqw0S_UsP9zAAzGh5dxm1UbkzgvMQP20SGfidUXiGnSZ94W80J_FONVj5_bcp0Ixm-loNeztsCdVjRoaA2vKk8YA70ZItypQrskPJq1JfyT_MqGx9JFga1eRVTLjorPgIa2hixvmj_PuIOUixw2HBnDDffG-WBQs6h5-wPnWj0PeRmydacURPbc9bai4jzqONc")' }}></div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[1200px] mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'Cargos', to: '/roles' },
            { label: 'Criar Cargo' }
          ]} />
        </div>

        {/* Page Heading & Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">Criar Novo Cargo</h1>
            <p className="mt-2 text-text-sec-light dark:text-text-sec-dark">Preencha os detalhes abaixo para cadastrar uma nova função no sistema.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/roles')} className="px-4 py-2 text-sm font-medium text-text-main-light dark:text-text-main-dark bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark shadow-sm shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Criar Cargo
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm">
          <form className="divide-y divide-border-light dark:divide-border-dark" onSubmit={handleSubmit}>
            {/* Section 1: Dados Cadastrais */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary">
                  <span className="material-symbols-outlined text-sm">badge</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Dados Cadastrais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="title">
                    Nome do Cargo <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                    id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="code">
                    Código do Cargo <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                    id="code" name="code" type="text" value={formData.code} onChange={handleInputChange} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="area">
                    Área <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                    id="area" name="area" type="text" value={formData.area} onChange={handleInputChange} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="department">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-11 px-3"
                    id="department" name="department" type="text" value={formData.department} onChange={handleInputChange} required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Classificação */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-sm">category</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Classificação</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
                    Senioridade Padrão <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Júnior', 'Pleno', 'Sênior'].map((level) => (
                      <label key={level} className="cursor-pointer">
                        <input
                          className="peer sr-only" name="seniority" type="radio" value={level}
                          checked={formData.seniority === level}
                          onChange={handleInputChange}
                        />
                        <div className="flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                          {level}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Descrição do Cargo */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-sm">description</span>
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Descrição do Cargo</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="mission">
                    Missão <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                    id="mission" name="mission" placeholder="Descreva o propósito principal deste cargo..." rows={3}
                    value={formData.mission} onChange={handleInputChange} required
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-main-light dark:text-text-main-dark" htmlFor="responsibilities">
                    Responsabilidades <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="block w-full rounded-lg border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3"
                    id="responsibilities" name="responsibilities" placeholder="Liste as principais atividades..." rows={6}
                    value={formData.responsibilities} onChange={handleInputChange} required
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRole;