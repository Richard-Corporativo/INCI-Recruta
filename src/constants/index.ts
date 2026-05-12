// @component Constants Barrel | @tipo config | @versao 1.0.0
// > Central de constantes — Kanban columns, departments, roles
/**
 * Central de Constantes do INCIRecruta
 */

import { KanbanColumnId } from "@src/types";

/**
 * Configuração das colunas do Kanban (Pipeline de Seleção)
 */
export const COLUMNS_CONFIG: { id: KanbanColumnId; title: string; dotColor: string }[] = [
    { id: 'received', title: 'Recebido', dotColor: 'bg-slate-400' },
    { id: 'screening', title: 'Triagem', dotColor: 'bg-blue-400' },
    { id: 'technical', title: 'Avaliação Técnica', dotColor: 'bg-purple-400' },
    { id: 'hr_interview', title: 'Entrevista RH', dotColor: 'bg-amber-400' },
    { id: 'manager_interview', title: 'Entrevista Gestor', dotColor: 'bg-orange-400' },
    { id: 'finalist', title: 'Finalista', dotColor: 'bg-emerald-400' },
    { id: 'hired', title: 'Contratado', dotColor: 'bg-green-500' },
    { id: 'rejected', title: 'Não Selecionado', dotColor: 'bg-red-400' }
];

// Re-exporta constantes de arquivos específicos
export * from './departments';
export * from './roles';
