import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@src/lib/supabase';
import { analyticsService, JobFunnelStats } from '@src/services/analytics.service';

export function useCompanyJobAnalytics() {
  const [data, setData] = useState<JobFunnelStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    const stats = await analyticsService.getCompanyJobFunnelData();
    setData(stats);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();

    const fallbackInterval = window.setInterval(fetchStats, 30000);

    const channel = supabase
      .channel('company-job-analytics')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analytics_events' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      window.clearInterval(fallbackInterval);
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  return { data, isLoading, refresh: fetchStats };
}
