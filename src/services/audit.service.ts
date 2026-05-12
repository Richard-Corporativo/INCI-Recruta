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
      details: params.details || {}
    });

    if (error) console.error('Error logging audit:', error);
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
    category?: string
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

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      company_id: companyId,
      action: action,
      resource_type: resourceType.toUpperCase() as ResourceType,
      resource_id: resourceId,
      details: {
        message,
        old: oldValue,
        new: newValue,
        category
      }
    });
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
}

export const auditService = new AuditService();
