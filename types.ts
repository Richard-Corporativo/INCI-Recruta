export interface Job {
  id: string | number;
  title: string;
  context: string;
  department: string;
  location: string;
  model: string;
  contract: string;
  urgency: 'Alta' | 'Média' | 'Baixa';
  status: 'Ativa' | 'Pausada' | 'Rascunho' | 'Encerrada';
  salary_min: number;
  salary_max: number;
  mission?: string;
  responsibilities?: string;
  seniority?: string;
  candidates_count: number;
  created_at: string;
  manager_id?: string;
}

export type KanbanColumnId = 'received' | 'screening' | 'technical' | 'hr_interview' | 'manager_interview' | 'finalist' | 'hired' | 'rejected';

export interface CandidateFeedback {
  id: string;
  rating: number;
  strengths: string;
  concerns: string;
  recommendation: 'advance' | 'hold' | 'reject';
  stage: string;
  createdAt: string;
  createdBy: string;
}

export interface Candidate {
  id: string;
  jobId?: string | number;
  initials: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role?: string;
  summary?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resume_url?: string;
  avatar?: string;
  match?: string;
  avatarColor: string;
  textColor: string;
  status?: string;
  actionRequired?: boolean;
  columnId: KanbanColumnId;
  applied_at?: string;
  hired_at?: string;
  feedbacks?: CandidateFeedback[];
  user_id?: string;
  nextInterview?: {
    type: string;
    date: string;
    time: string;
  };
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
  mission?: string;
  responsibilities?: string;
  seniority?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'recruiter' | 'quality' | 'dp' | 'candidate';
  status: 'active' | 'suspended';
  lastAccess: string;
  password?: string;
  avatar?: string;
  department?: string;
  scope?: {
    vacancy_view_type: 'direct' | 'department';
    allowed_departments: string[];
    allowed_role_codes?: string[];
  };
  custom_permissions?: {
    close_job?: boolean;
    approve_finalist?: boolean;
    register_feedback?: boolean;
    view_salaries?: boolean;
  };
}

export interface SystemSettings {
  manager_permissions: {
    move_to_finalist: boolean;
    mark_not_selected: boolean;
    return_candidate_stage: boolean;
    close_job: boolean;
  };
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
