import React from 'react';
import { Role } from '../types';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const mockRoles: Role[] = [
  { id: '1', code: 'TI-DEV-002', title: 'Analista de Sistemas Pleno', department: 'Tecnologia', area: 'Desenvolvimento', open_positions: 2, status: 'Ativo', updated_at: 'Há 2h' },
  { id: '2', code: 'RH-GEN-001', title: 'Gerente de Recursos Humanos', department: 'Recursos Humanos', area: 'Gestão', open_positions: 0, status: 'Ativo', updated_at: 'Ontem' },
  { id: '3', code: 'PD-DES-003', title: 'Product Designer', department: 'Produto', area: 'Design', open_positions: 1, status: 'Ativo', updated_at: 'Há 3 dias' },
  { id: '4', code: 'ADM-OPS-001', title: 'Auxiliar Administrativo', department: 'Administrativo', area: 'Operações', open_positions: 0, status: 'Inativo', updated_at: '12/04/2023' },
  { id: '5', code: 'TI-DAT-001', title: 'Engenheiro de Dados', department: 'Tecnologia', area: 'Data & AI', open_positions: 3, status: 'Ativo', updated_at: 'Hoje' },
];

const Roles: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Cargos' }]} />
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Listagem de Cargos</h1>
          <p className="text-slate-500 text-sm mt-1">Visualize e gerencie todos os cargos cadastrados no sistema.</p>
        </div>
        <Link to="/roles/new" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Criar Novo Cargo</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Busca</label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
              <input className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Nome do cargo..." type="text" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Departamento</label>
            <select className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">Todos Departamentos</option>
              <option value="TI">Tecnologia (TI)</option>
              <option value="RH">Recursos Humanos</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</label>
            <select className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div>
            <button className="w-full h-[42px] px-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:bg-slate-50 rounded-lg">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Área</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Vagas Abertas</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockRoles.map((role) => (
              <tr key={role.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{role.title}</span>
                    <span className="text-xs text-slate-500">Atualizado: {role.updated_at}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{role.department}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{role.area}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.open_positions > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                    {role.open_positions} Vagas
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${role.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className={`text-sm font-medium ${role.status === 'Ativo' ? 'text-emerald-700' : 'text-slate-500'}`}>{role.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-slate-100" title="Editar">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50" title="Deletar">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">1</span> a <span className="font-semibold text-slate-700">5</span> de <span className="font-semibold text-slate-700">24</span> resultados
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-white">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;