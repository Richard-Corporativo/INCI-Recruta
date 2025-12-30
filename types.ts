export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'CLT' | 'PJ' | 'Estágio';
  status: 'Ativa' | 'Encerrada' | 'Pausada';
  urgency: 'Alta' | 'Média' | 'Baixa';
  created_at: string;
  candidates_count: number;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Recebido' | 'Triagem' | 'Entrevista RH' | 'Entrevista Gestor' | 'Finalista' | 'Contratado' | 'Reprovado';
  match: number;
  applied_date: string;
  avatar_initials: string;
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
