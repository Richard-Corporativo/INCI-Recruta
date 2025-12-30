import React, { useState } from 'react';
import { Role } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRoles } from '../hooks/useRoles';
import ConfirmationModal from '../components/ConfirmationModal';

const Roles: React.FC = () => {
  const { roles, deleteRole } = useRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const filteredRoles = roles.filter(role =>
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Cargos' }]} />
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Listagem de Cargos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Visualize e gerencie todos os cargos cadastrados no sistema.</p>
        </div>
        <Link to="/roles/new" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Criar Novo Cargo</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Busca</label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white"
                placeholder="Nome do cargo ou departamento..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Status</label>
            <select className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white">
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => setSearchTerm('')}
              className="w-full h-[42px] px-4 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden text-slate-900 dark:text-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Área</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Vagas Abertas</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRoles.map((role) => (
              <tr key={role.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{role.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">ID: {role.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{role.department}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{role.area}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.open_positions > 0 ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {role.open_positions} Vagas
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${role.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className={`text-sm font-medium ${role.status === 'Ativo' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{role.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/roles/${role.id}/edit`)}
                      className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(role.id, role.title)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Deletar"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRoles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                  Nenhum cargo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total de <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredRoles.length}</span> resultados
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteRole(deleteConfirm.id)}
        title="Excluir Cargo"
        message={`Tem certeza que deseja excluir o cargo "${deleteConfirm?.title}"? esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        type="danger"
      />
    </div>
  );
};

export default Roles;