import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@src/lib/supabase';
import { analyticsService, JobFunnelStats } from '@src/services/analytics.service';

export function useCompanyJobAnalytics() {
  const [data, setData] = useState<JobFunnelStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const stats = await analyticsService.getCompanyJobFunnelData();
      setData(stats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchStats, 5000);
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();

    let channel: ReturnType<typeof supabase.channel>;
    supabase.from('company_members')
      .select('company_id')
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data: member }) => {
        const companyFilter = member?.company_id
          ? `company_id=eq.${member.company_id}`
          : undefined;

        channel = supabase
          .channel('company-job-analytics')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'analytics_events',
              ...(companyFilter ? { filter: companyFilter } : {}),
            },
            debouncedFetch
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'jobs',
              ...(companyFilter ? { filter: companyFilter } : {}),
            },
            debouncedFetch
          )
          .subscribe();
      });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchStats, debouncedFetch]);

  return { data, isLoading, refresh: fetchStats };
}
