import { KanbanColumnId } from './types';

export type Column = {
    id: KanbanColumnId;
    title: string;
    dotColor: string;
};

export const COLUMNS_CONFIG: Column[] = [
    { id: 'received', title: 'Recebido', dotColor: 'bg-muted-foreground/40' },
    { id: 'screening', title: 'Em Triagem', dotColor: 'bg-accent' },
    { id: 'technical', title: 'Avaliação Téc.', dotColor: 'bg-primary/20' },
    { id: 'hr_interview', title: 'Entrevista RH', dotColor: 'bg-primary/10' },
    { id: 'manager_interview', title: 'Entrevista Gestor', dotColor: 'bg-primary' },
    { id: 'finalist', title: 'Finalista', dotColor: 'bg-primary/30' },
    { id: 'hired', title: 'Contratado', dotColor: 'bg-primary' },
    { id: 'rejected', title: 'Não Selecionado', dotColor: 'bg-muted-foreground/60' },
    { id: 'withdrawn', title: 'Desistências', dotColor: 'bg-orange-500' },
];
