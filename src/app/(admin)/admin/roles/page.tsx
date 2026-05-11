'use client';
import { Icon } from "@iconify/react";

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@src/components/shared/Breadcrumbs';
import { useRoles } from '@src/hooks/useRoles';
import { useJobs } from '@src/hooks/useJobs';
import ConfirmationModal from '@src/components/shared/ConfirmationModal';
import { useQuickView } from '@src/context/QuickViewContext';
import { useAuth } from '@src/context/AuthContext';

const RolesPage: React.FC = () => {
  const { roles, deleteRole } = useRoles();
  const { jobs } = useJobs();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const { openQuickView } = useQuickView();

  const canManageRoles = !!user && user.role !== 'candidate';

  const filteredRoles = roles
    .map(role => ({ ...role, activeJobsCount: jobs.filter(j => j.role_id === role.id && j.status === 'Ativa').length }))
    .filter(role => {
      const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (role.department || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && role.status === 'Ativo') ||
        (statusFilter === 'inactive' && role.status === 'Inativo');
      return matchesSearch && matchesStatus;
    });

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Cargos' }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Biblioteca de Cargos</h1>
          <p className="text-sm text-muted-foreground mt-1">{filteredRoles.length} cargos encontrados</p>
        </div>
        {canManageRoles && (
          <Link href="/admin/roles/new" className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shrink-0">
            <Icon icon="material-symbols:add" className="size-5" />
            Novo cargo
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar p-1 -m-1 items-center flex-wrap">
        <input type="text" placeholder="Buscar cargo, código ou departamento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="h-8 px-3 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 w-64" />
        <div className="w-px h-6 bg-border" />
        <div className="flex gap-2 items-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">Status</span>
          {[{ val: 'all', label: 'Todos' }, { val: 'active', label: 'Ativos' }, { val: 'inactive', label: 'Inativos' }].map(s => (
            <button key={s.val} onClick={() => setStatusFilter(s.val)}
              className={`h-8 px-3 rounded-2xl text-xs font-semibold transition-all ${
                statusFilter === s.val ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
              }`}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Grid cards */}
      {filteredRoles.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center">
          <Icon icon="material-symbols:work" className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum cargo encontrado</h3>
          <p className="text-sm text-muted-foreground mb-6">Ajuste os filtros ou crie um novo cargo.</p>
          {canManageRoles && (
            <Link href="/admin/roles/new" className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2">
              <Icon icon="material-symbols:add" className="size-5" /> Novo cargo
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {filteredRoles.map(role => (
            <div key={role.id} role="listitem" className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:bg-muted transition-colors group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{role.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground px-1.5 py-0.5 bg-muted rounded border border-border/50 tracking-wider">{role.code}</span>
                  </div>
                </div>
                <span className={`shrink-0 h-5 px-2 rounded text-[10px] font-semibold flex items-center gap-1 ${
                  role.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  <span className={`size-1.5 rounded-full ${role.status === 'Ativo' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  {role.status === 'Ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-xs font-semibold">{role.department}</span>
              </p>

              <p className="text-xs text-muted-foreground">
                <span className="tabular-nums font-semibold text-foreground">{role.activeJobsCount}</span> vagas ativas vinculadas
              </p>

              <div className="flex items-center gap-1 pt-2 border-t border-border mt-auto">
                <button onClick={() => openQuickView('role', role)}
                  className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Visualizar">
                  <Icon icon="material-symbols:visibility" className="size-4" />
                </button>
                {canManageRoles && (
                  <>
                    <Link href={`/admin/roles/${role.id}/edit`}
                      className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                      <Icon icon="material-symbols:edit" className="size-4" />
                    </Link>
                    <button onClick={() => setDeleteConfirm({ id: role.id, title: role.title })}
                      className="size-8 flex items-center justify-center rounded-2xl text-muted-foreground hover:text-error hover:bg-error/10 transition-colors ml-auto" title="Excluir">
                      <Icon icon="material-symbols:delete" className="size-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { if (deleteConfirm) { deleteRole(deleteConfirm.id); setDeleteConfirm(null); } }}
        title="Excluir Cargo"
        message={`Tem certeza que deseja excluir o cargo "${deleteConfirm?.title}"?`}
        confirmLabel="Excluir"
        type="danger"
      />
    </div>
  );
};

export default RolesPage;
