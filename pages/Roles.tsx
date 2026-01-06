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
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0">
        <div className="mb-3">
          <Breadcrumbs items={[{ label: 'Cargos' }]} />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Biblioteca de cargos</h1>
            <p className="text-muted-foreground text-sm mt-1">Gerencie a estrutura de cargos e requisitos pré-definidos para novas vagas.</p>
          </div>
          <Link to="/roles/new" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground border border-border/40 px-5 py-2.5 rounded-base text-sm font-semibold shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 active:translate-y-[1px]">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Novo cargo</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">
        <div className="max-w-[1920px] mx-auto">
          {/* Filters */}
          <div className="bg-card p-5 rounded-lg border border-border shadow-sm mb-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Busca</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground material-symbols-outlined text-[20px]">search</span>
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground font-medium"
                    placeholder="Nome do cargo ou departamento..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Status</label>
                <select className="w-full mt-1.5 px-3 py-2 bg-background border border-border rounded-base text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 text-foreground font-semibold cursor-pointer">
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="w-full h-[38px] px-4 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 border border-transparent hover:bg-muted rounded-base"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted border-b border-border">
                <tr className="text-[11px] font-semibold text-muted-foreground">
                  <th className="px-6 py-5">Identificação / código</th>
                  <th className="px-6 py-5">Departamento / área</th>
                  <th className="px-6 py-5 text-center">Vagas ativas</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="group hover:bg-muted/40 transition-all duration-200 ease-in-out">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground leading-tight">{role.title}</span>
                        <span className="text-xs text-muted-foreground mt-1 italic font-semibold">{role.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-muted text-foreground border border-border text-xs font-semibold">
                        {role.department}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-semibold text-foreground">{role.activeJobsCount || 0}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${role.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                        <span className={`size-1.5 rounded-full ${role.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`}></span>
                        {role.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/roles/${role.id}/edit`}
                          className="flex items-center justify-center size-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-base transition-all duration-200"
                          title="Visualizar Detalhes"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(role.id, role.title)}
                          className="flex items-center justify-center size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-base transition-all duration-200"
                          title="Excluir Cargo"
                          aria-label={`Excluir cargo ${role.title}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground font-semibold italic">
                Mostrando {filteredRoles.length} cargos na biblioteca
              </span>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            deleteRole(deleteConfirm.id);
            setDeleteConfirm(null);
          }
        }}
        title="Excluir Cargo"
        message={`Tem certeza que deseja excluir o cargo "${deleteConfirm?.title}"? Esta ação removerá o modelo da biblioteca, mas não afetará seleções em andamento.`}
        confirmLabel="Excluir"
        type="danger"
      />
    </div>
  );
};

export default Roles;
