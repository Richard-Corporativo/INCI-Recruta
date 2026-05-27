import { supabase } from '@src/lib/supabase';
import { getCurrentCompanyId } from '@src/lib/tenant';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'MOVE';
export type ResourceType = 'JOB' | 'CANDIDATE' | 'ROLE' | 'USER' | 'SETTINGS';

export interface AuditLog {
  id: string;
  user_id: string;
  company_id: string;
  action: AuditAction;
  resource_type: ResourceType;
  resource_id: string;
  job_id?: string;
  category?: string;
  details: any;
  created_at: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export class AuditService {
  /**
   * Log a standard action
   */
  async log(params: {
    action: AuditAction;
    resource_type: ResourceType;
    resource_id?: string;
    details?: any;
    company_id?: string;
    job_id?: string;
    category?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const companyId = params.company_id || await getCurrentCompanyId();
    if (!companyId) {
      console.warn('[AuditService] Sem company_id no contexto — log ignorado.');
      return;
    }

    const { error } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      company_id: companyId,
      action: params.action,
      resource_type: params.resource_type,
      resource_id: params.resource_id,
      job_id: params.job_id,
      category: params.category,
      details: params.details || {}
    });

    if (error) {
      console.error('[AuditService] Erro ao gravar log:', error.message, {
        action: params.action,
        resource: params.resource_type,
        id: params.resource_id
      });
    }
  }

  /**
   * Compatibility method for logging structured changes (deltas)
   */
  static async logChange(
    resourceType: string,
    resourceId: string,
    message: string,
    oldValue?: any,
    newValue?: any,
    category?: string,
    jobId?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Determine action based on presence of values
    let action: AuditAction = 'UPDATE';
    if (!oldValue && newValue) action = 'CREATE';
    if (oldValue && !newValue) action = 'DELETE';

    const companyId = await getCurrentCompanyId();
    if (!companyId) {
      console.warn('[AuditService] logChange sem company_id no contexto — ignorado.');
      return;
    }

    const { error } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      company_id: companyId,
      action: action,
      category: category,
      job_id: jobId,
      resource_type: (resourceType.toUpperCase() || 'UNKNOWN') as ResourceType,
      resource_id: resourceId?.toString(),
      details: {
        message,
        old: oldValue,
        new: newValue
      }
    });

    if (error) {
      console.error('[AuditService] Erro no logChange:', error.message, {
        resourceType,
        action,
        error
      });
    }
  }

  async getLogs(limit = 50) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Fetch users separately to avoid join errors
    const userIds = Array.from(new Set(data.map(log => log.user_id).filter(Boolean)));
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email, role')
      .in('id', userIds);

    const userMap = new Map(users?.map(u => [u.id, u]));
    
    return data.map(log => ({
      ...log,
      user: userMap.get(log.user_id)
    })) as AuditLog[];
  }

  async cleanup(days = 90) {
    const { data, error } = await supabase.rpc('cleanup_old_audit_logs', { days_to_keep: days });
    if (error) {
      console.error('Error cleaning up logs:', error);
      throw error;
    }
    return data as number;
  }

  subscribeToLogs(callback: (log: AuditLog) => void) {
    const channelName = `audit_logs_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    return supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        async (payload) => {
          const { data: userProfile } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', payload.new.user_id)
            .single();
            
          callback({
            ...payload.new,
            user: userProfile
          } as unknown as AuditLog);
        }
      )
      .subscribe();
  }

  getFriendlyAction(action: string, category?: string): string {
    const map: Record<string, string> = {
      'CREATE': 'Criou um novo registro',
      'UPDATE': 'Atualizou informações',
      'DELETE': 'Removeu um registro',
      'MOVE': 'Alterou a etapa do candidato',
      'LOGIN': 'Acessou o sistema',
      'LOGOUT': 'Saiu do sistema',
      'candidate_movement': 'Moveu o candidato no funil',
      'job_management': 'Editou as configurações da vaga',
      'interview_scheduled': 'Agendou uma entrevista',
      'feedback_added': 'Adicionou feedback ao candidato',
      'candidate_created': 'Candidatura recebida no sistema',
      'candidate_deleted': 'Candidatura removida',
      'user_management': 'Gerenciou usuários da equipe',
    };

    return map[category || ''] || map[action] || action;
  }

  formatDetails(details: any): string {
    if (!details) return 'Sem detalhes disponíveis';

    if (typeof details === 'string') {
      return details
        .replace('Workflow Transition:', 'Mudança de Status:')
        .replace('draft', 'Rascunho')
        .replace('pending_approval', 'Aguardando Aprovação')
        .replace('published', 'Publicada')
        .replace('closed', 'Encerrada')
        .replace('archived', 'Arquivada')
        .replace('->', '➔');
    }

    // Mensagem explícita tem prioridade máxima — evita "[object Object]" em objetos complexos
    if (details.message) {
      return details.message.replace(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/g,
        (iso: string) => {
          try {
            return new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: false,
              timeZone: 'America/Sao_Paulo'
            }).format(new Date(iso));
          } catch { return iso; }
        }
      );
    }

    if (details.old !== undefined && details.new !== undefined) {
      if (details.old !== null && details.new !== null &&
          typeof details.old === 'object' && typeof details.new === 'object') {

        // Movimentação de candidato: exibe rótulo legível de etapa
        if ('column_id' in (details.old as object) || 'column_id' in (details.new as object)) {
          const stageLabel: Record<string, string> = {
            'received': 'Recebido', 'screening': 'Triagem',
            'technical': 'Avaliação Técnica', 'hr_interview': 'Entrevista RH',
            'manager_interview': 'Entrevista Gestor', 'finalist': 'Finalista',
            'hired': 'Contratado', 'rejected': 'Encerrado'
          };
          const from = stageLabel[(details.old as any).column_id] || (details.old as any).column_id;
          const to   = stageLabel[(details.new as any).column_id] || (details.new as any).column_id;
          return `${from} ➔ ${to}`;
        }

        const labelMap: Record<string, string> = {
          'title': 'Título', 'description': 'Descrição', 'status': 'Status',
          'experience_min': 'Experiência Mínima', 'salary_min': 'Salário Mínimo',
          'salary_max': 'Salário Máximo', 'location': 'Localização',
          'work_schedule': 'Regime de Trabalho', 'column_id': 'Etapa',
          'name': 'Nome', 'email': 'E-mail', 'phone': 'Telefone',
          'responsibilities': 'Responsabilidades', 'requirements': 'Requisitos'
        };
        const changes = Object.keys(details.new as object)
          .filter(k => JSON.stringify((details.old as any)[k]) !== JSON.stringify((details.new as any)[k]))
          .map(k => labelMap[k] || k);
        if (changes.length > 0) return `Campos alterados: ${changes.join(', ')}`;
      }

      if (details.old !== details.new && details.old !== null && details.new !== null) {
        return `Alterado de "${details.old}" para "${details.new}"`;
      }
    }

    try {
      if (typeof details === 'object') {
        const keys = Object.keys(details as object).filter(k => !['message', 'old', 'new'].includes(k));
        return keys.length > 0 ? `Atualização em: ${keys.join(', ')}` : 'Informações atualizadas';
      }
      return String(details);
    } catch {
      return 'Informações atualizadas';
    }
  }
}

export const auditService = new AuditService();
