export interface Job {
  id: string | number;
  title: string;
  context: string;
  department: string;
  location: string;
  model: 'Remoto' | 'Híbrido' | 'Presencial';
  contract: 'PJ' | 'CLT';
  urgency: 'Alta' | 'Média' | 'Baixa';
  status: 'Ativa' | 'Pausada' | 'Rascunho' | 'Encerrada';
  salary_min: number;
  salary_max: number;
  mission?: string;
  candidates_count: number;
  created_at: string;
  manager_id?: string;
}

export type KanbanColumnId = 'received' | 'screening' | 'technical' | 'hr_interview' | 'manager_interview' | 'finalist' | 'hired' | 'rejected';

export interface Candidate {
  id: string;
  jobId?: string | number;
  initials: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  time: string;
  role?: string;
  match?: string;
  avatarColor: string;
  textColor: string;
  status?: string;
  actionRequired?: boolean;
  columnId: KanbanColumnId;
  applied_at?: string;
  hired_at?: string;
}

export interface Role {
  id: string;
  code: string;
  title: string;
  area: string;
  department: string;
  open_positions: number;
  status: 'Ativo' | 'Inativo';
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'recruiter' | 'quality' | 'dp';
  status: 'active' | 'suspended';
  lastAccess: string;
  password?: string;
  avatar?: string;
  department?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user_name: string;
  timestamp: string;
  details: string;
  entity_type?: string;
  entity_id?: string;
}
