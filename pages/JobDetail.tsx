import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import { useUsers } from '../hooks/useUsers';

const JobDetail: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useJobs();
  const { users } = useUsers();

  const job = jobs.find(j => j.id.toString() === id);
  const manager = users.find(u => u.id === job?.manager_id);

  const handleCloseJob = () => {
    if (!id) return;
    updateJob(id, { status: 'Encerrada' });
    setIsModalOpen(false);
  };

  if (!job) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vaga não encontrada</h2>
        <Link to="/jobs" className="text-primary hover:underline mt-4 inline-block">Voltar para Vagas</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark relative">
      <header className="flex-none bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 px-8 py-6 z-10 shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link className="hover:text-primary hover:underline" to="/jobs">Vagas</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-900 dark:text-white font-medium">Detalhes</span>
          </div>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.02em]">{job.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">ID: {job.id} • Criado em {job.created_at}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/jobs/${id}/edit`} className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors gap-2 text-sm font-bold shadow-sm">
                <span className="material-symbols-outlined text-[20px]">edit</span>
                <span>Editar contexto</span>
              </Link>
              <button
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors gap-2 text-sm font-bold shadow-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                <span>Encerrar vaga</span>
              </button>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap pt-2">
            <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-2 pr-3">
              <span className="material-symbols-outlined text-[16px] text-slate-500">location_on</span>
              <p className="text-slate-900 dark:text-slate-200 text-xs font-semibold uppercase tracking-wide">{job.location} - {job.model}</p>
            </div>
            <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-2 pr-3">
              <span className="material-symbols-outlined text-[16px] text-slate-500">description</span>
              <p className="text-slate-900 dark:text-slate-200 text-xs font-semibold uppercase tracking-wide">{job.contract}</p>
            </div>
            <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-amber-50 border border-amber-200 pl-2 pr-3">
              <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
              <p className="text-amber-800 text-xs font-semibold uppercase tracking-wide">{job.urgency} Urgência</p>
            </div>
            <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-emerald-50 border border-emerald-200 pl-2 pr-3">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <p className="text-emerald-800 text-xs font-semibold uppercase tracking-wide">{job.status}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">

          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">article</span>
                  Conteúdo do Cargo
                </h2>
                <span className="text-xs font-medium text-slate-500 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded">Somente Leitura</span>
              </div>
              <div className="p-8 text-slate-900 dark:text-slate-200 text-sm leading-relaxed space-y-6">
                <div>
                  <h3 className="font-bold text-base mb-2 text-slate-900 dark:text-white">Descrição da Vaga</h3>
                  <p className="text-slate-500 dark:text-slate-400">{job.context}</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-700" />
                <div>
                  <h3 className="font-bold text-base mb-2 text-slate-900 dark:text-white">Missão</h3>
                  <p className="text-slate-500 dark:text-slate-400">{job.mission}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                  Contexto da Vaga
                </h2>
                <Link to={`/jobs/${id}/edit`} className="text-primary text-xs font-bold hover:underline">Editar</Link>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Departamento</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{job.department}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Faixa Salarial</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">R$ {job.salary_min.toLocaleString()} - R$ {job.salary_max.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Gestor Responsável</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{manager?.name || 'Não atribuído'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#1a202c] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100 dark:border-slate-700">
              <div className="bg-white dark:bg-[#1a202c] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-bold leading-6 text-slate-900 dark:text-white">Encerrar Vaga?</h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Encerrar remove a vaga das abertas, mantendo histórico e auditoria. Esta ação não pode ser desfeita facilmente.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-100 dark:border-slate-700">
                <button className="inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleCloseJob} type="button">Encerrar Vaga</button>
                <button className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto" onClick={() => setIsModalOpen(false)} type="button">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;