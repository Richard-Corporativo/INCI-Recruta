// @service AnalyticsService | @tipo service | @versao 1.0.0
// > Serviço de rastreamento de eventos para o funil de candidatos

import { supabase } from '@src/lib/supabase';

export type AnalyticsEventName =
  | 'landing_view'
  | 'search_performed'
  | 'filter_applied'
  | 'job_click'
  | 'candidate_registration_started'
  | 'candidate_registration_completed'
  | 'application_started'
  | 'application_completed'
  | 'talent_bank_click';

export interface JobFunnelStats {
  job_id: string;
  job_title: string;
  job_status: string | null;
  department: string | null;
  created_at: string | null;
  job_clicks: number;
  job_clicks_unique: number;
  application_starts: number;
  application_starts_unique: number;
  application_completed: number;
  application_completed_unique: number;
}

class AnalyticsService {
  private sessionId: string;
  private static readonly SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutos

  constructor() {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('inci_analytics_session_id');
      const storedTs = localStorage.getItem('inci_analytics_session_ts');
      const now = Date.now();
      const isExpired = !storedTs || (now - Number(storedTs)) > AnalyticsService.SESSION_EXPIRY_MS;

      if (storedId && !isExpired) {
        this.sessionId = storedId;
      } else {
        this.sessionId = crypto.randomUUID();
        localStorage.setItem('inci_analytics_session_id', this.sessionId);
        localStorage.setItem('inci_analytics_session_ts', String(now));
      }
    } else {
      this.sessionId = 'server-side';
    }
  }

  async trackEvent(
    eventName: AnalyticsEventName,
    metadata: Record<string, any> = {},
    jobId?: string
  ) {
    try {
      // Usa getSession que é mais rápido (lê do storage) do que getUser (valida no servidor)
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const effectiveJobId = jobId || metadata.job_id || null;
      let companyId: string | null = null;
      if (effectiveJobId) {
        const { data: jobRow } = await supabase
          .from('jobs')
          .select('company_id')
          .eq('id', effectiveJobId)
          .maybeSingle();
        companyId = (jobRow?.company_id as string) ?? null;
      }

      const { error } = await supabase.from('analytics_events').insert({
        event_name: eventName,
        user_id: user?.id || null,
        company_id: companyId,
        session_id: this.sessionId,
        job_id: effectiveJobId,
        metadata,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : '',
      });

      if (error) {
        console.error('Error tracking event:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      }

      if (!error && typeof window !== 'undefined') {
        localStorage.setItem('inci_analytics_session_ts', String(Date.now()));
      }
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }

  // Atalhos para eventos comuns
  trackLandingView() {
    return this.trackEvent('landing_view');
  }

  trackSearch(query: string, resultsCount: number) {
    return this.trackEvent('search_performed', { query, resultsCount });
  }

  trackJobClick(jobId: string, jobTitle: string) {
    return this.trackEvent('job_click', { jobTitle }, jobId);
  }

  trackApplicationStart(jobId: string) {
    return this.trackEvent('application_started', {}, jobId);
  }

  trackApplicationComplete(jobId: string) {
    return this.trackEvent('application_completed', {}, jobId);
  }

  async getCompanyJobFunnelData(): Promise<JobFunnelStats[]> {
    try {
      const { data, error } = await supabase.rpc('get_company_job_analytics');

      if (error) {
        console.error('Error fetching company job analytics:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        job_id: row.job_id,
        job_title: row.job_title,
        job_status: row.job_status,
        department: row.department,
        created_at: row.created_at,
        job_clicks: Number(row.job_clicks) || 0,
        job_clicks_unique: Number(row.job_clicks_unique) || 0,
        application_starts: Number(row.application_starts) || 0,
        application_starts_unique: Number(row.application_starts_unique) || 0,
        application_completed: Number(row.application_completed) || 0,
        application_completed_unique: Number(row.application_completed_unique) || 0,
      }));
    } catch (err) {
      console.error('Company job analytics fetch error:', err);
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();
