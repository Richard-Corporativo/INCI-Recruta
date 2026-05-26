// @component Type Definitions | @tipo type | @versao 1.0.0
// > Interfaces canônicas do domínio INCIRecruta
/**
 * @component TypeDefinitions | @tipo type | @versao 1.0.0
 * @api Job, Candidate, CandidateFeedback, CandidateAvatar, CandidateResume, Role, User, SystemSettings, AuditLog, StageHistory, Education, Experience, KanbanColumnId, AuditLogCategory
 * > Fonte única de verdade para interfaces do domínio
 */

// ─── Entidades base ──────────────────────────────────────────────────────────

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}

// ─── Job ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string | number;
  role_id: string;
  title: string;
  context: string;
  department: string;
  location: string;
  model: string;
  contract: string;
  urgency: 'Alta' | 'Média' | 'Baixa';
  is_pcd?: boolean | null;
  pcd?: boolean | null;
  pcd_only?: boolean | null;
  exclusive_pcd?: boolean | null;
  status: 'Ativa' | 'Pausada' | 'Rascunho' | 'Encerrada';
  salary_min: number;
  salary_max: number;
  mission?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string[];
  seniority?: string;
  candidates_count: number;
  created_at: string;
  manager_id?: string;
  registration_deadline?: string;
  positions_count?: number;
  work_schedule?: string;
  approval_status?: 'Rascunho' | 'Pendente' | 'Aprovado';
  workflow_status?: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived';
  experience_min?: string;
  reports_to?: string;
  sla_settings?: Record<string, { days: number; owner_id?: string; owner?: 'Qualidade' | 'Gestor' }>;
  revision?: number;
  company_id?: string;
  company_slug?: string;
  company_name?: string;
  requirements_technical?: string | string[];
  requirements_behavioral?: string | string[];
  kpis?: string | string[];
  competencies?: string | string[];
  role_code?: string;
  job_number?: number;
}

// ─── Candidate ───────────────────────────────────────────────────────────────

export type KanbanColumnId =
  | 'received'
  | 'screening'
  | 'technical'
  | 'hr_interview'
  | 'manager_interview'
  | 'finalist'
  | 'hired'
  | 'rejected';

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
  has_resume?: boolean;
  has_avatar?: boolean;
  resume_name?: string;
  user_id?: string;
  resumeName?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  languages?: string[];
  avatar?: string;
  match?: string;
  avatarColor: string;
  textColor: string;
  status?: string;
  time?: string;
  actionRequired?: boolean;
  columnId: KanbanColumnId;
  applied_at?: string;
  hired_at?: string;
  feedbacks?: CandidateFeedback[];
  pretension_min?: number;
  pretension_max?: number;
  availability?: string;
  search_status?: string;
  desired_work_model?: 'Presencial' | 'Híbrido' | 'Remoto';
  competencies?: string[];
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  nextInterview?: {
    type: string;
    date: string;
    time: string;
  };
  currentStageEntry?: string;
  terms_accepted?: boolean;
  terms_accepted_at?: string;
}

export interface CandidateAvatar {
  id: string;
  candidate_id: string;
  file_data: Uint8Array;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface CandidateResume {
  id: string;
  candidate_id: string;
  file_data: Uint8Array;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

// ─── Role ─────────────────────────────────────────────────────────────────────

export interface Role {
  id: string;
  code: string;
  title: string;
  company_id?: string;
  area: string;
  department: string;
  open_positions: number;
  status: 'Ativo' | 'Inativo';
  updated_at: string;
  mission?: string;
  responsibilities?: string;
  seniority?: string;
  requirements?: string;
  activeJobsCount?: number;
  salary_min?: number;
  salary_max?: number;
  experience_min?: string;
  reports_to?: string;
  requirements_technical?: string | string[];
  requirements_behavioral?: string | string[];
  kpis?: string | string[];
  competencies?: string | string[];
  level?: number;
}

// ─── Company (multi-tenant) ───────────────────────────────────────────────────

export interface TalentPoolSettings {
  who_can_access: ('admin' | 'recruiter' | 'manager')[];
  visible_areas: string[];
  retention_days: number;
  allow_reuse: boolean;
}

export type RolePermissionKey = 'create_job' | 'approve_job' | 'move_candidate' | 'view_salaries' | 'export_data' | 'access_tests';

export interface RolePermissionsMatrix {
  [role: string]: Record<RolePermissionKey, boolean>;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  cnpj?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  status: 'active' | 'suspended' | 'trial' | 'pending';
  maintenance_mode: boolean;
  maintenance_message?: string | null;
  created_at: string;
  updated_at: string;
  // Perfil institucional
  website?: string | null;
  linkedin_url?: string | null;
  segment?: string | null;
  headcount?: string | null;
  company_type?: string | null;
  // Localização
  cep?: string | null;
  state_code?: string | null;
  city?: string | null;
  address?: string | null;
  work_model?: 'presencial' | 'hibrido' | 'remoto' | 'outro' | null;
  work_model_custom?: string | null;
  // Estrutura interna
  internal_roles?: string[];
  // Configurações avançadas
  talent_pool_settings?: TalentPoolSettings;
  role_permissions?: RolePermissionsMatrix;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'recruiter' | 'manager' | 'quality' | 'dp';
  status: 'active' | 'suspended' | 'invited';
  invited_email?: string | null;
  invited_at?: string | null;
  joined_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  full_name?: string;
  company_name?: string;
  email: string;
  role: 'super_admin' | 'owner' | 'admin' | 'manager' | 'recruiter' | 'quality' | 'dp' | 'candidate';
  status: 'active' | 'suspended' | 'pending_approval';
  company_id?: string | null;
  lastAccess?: string;
  password?: string;
  avatar?: string;
  department?: string;
  phone?: string;
  location?: string;
  summary?: string;
  linkedin?: string;
  portfolio?: string;
  resume_url?: string;
  resume_name?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  languages?: string[];
  profile_status?: 'incomplete' | 'complete';
  terms_accepted?: boolean;
  terms_accepted_at?: string;
  scope?: {
    vacancy_view_type: 'direct' | 'department' | 'selected_departments';
    allowed_departments: string[];
    allowed_role_codes?: string[];
  };
  custom_permissions?: {
    close_job?: boolean;
    approve_finalist?: boolean;
    register_feedback?: boolean;
    view_salaries?: boolean;
    return_candidate_stage?: boolean;
    view_candidates?: boolean;
    view_resume?: boolean;
    view_contact?: boolean;
    schedule_interview?: boolean;
    move_candidate_stage?: boolean;
    reject_candidate?: boolean;
    mark_finalist?: boolean;
    request_behavioral_test?: boolean;
    view_behavioral_test_result?: boolean;
    export_candidate_data?: boolean;
    archive_job?: boolean;
  };
}

// ─── System / Audit ───────────────────────────────────────────────────────────

export interface SystemSettings {
  manager_permissions: {
    move_to_finalist: boolean;
    mark_not_selected: boolean;
    return_candidate_stage: boolean;
    close_job: boolean;
    view_salaries: boolean;
  };
}

export type AuditLogCategory =
  | 'privileges'
  | 'scope'
  | 'user_management'
  | 'system'
  | 'candidate_movement'
  | 'job_management'
  | 'interview_scheduled'
  | 'feedback_added';

export interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  company_id: string;
  timestamp: string;
  details: string;
  entity_type?: string;
  entity_id?: string;
  resource_type?: string;
  resource_id?: string;
  job_id?: string;
  affected_user_id?: string;
  affected_user_name?: string;
  reason?: string;
  category?: AuditLogCategory;
  old_value?: any;
  new_value?: any;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export interface StageHistory {
  id: string;
  candidate_id: string;
  stage_id: KanbanColumnId | string;
  entry_time: string;
  exit_time?: string;
  duration_seconds?: number;
}

// ─── Interview (Agenda) ──────────────────────────────────────────────────────

export interface Interview {
  id: string;
  company_id: string;
  candidate_id: string;
  job_id?: string | number;
  interviewer_id?: string;
  interviewer_names?: string;
  stage?: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  address?: string;
  type?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  candidate_name?: string; // Virtual/Joined field
  job_title?: string;      // Virtual/Joined field
  interviewer_name?: string; // Virtual/Joined field
}

// ─── Candidate search & feedback ─────────────────────────────────────────────

export interface CandidateSearchFilters {
  query?: string;
  skills?: string[];
  competencies?: string[];
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  availability?: string;
  status?: string;
}

export interface CandidateFeedbackInput {
  rating?: number;
  content?: string;
  strengths?: string;
  concerns?: string;
  recommendation?: string;
  stage?: string;
  createdBy?: string;
}
