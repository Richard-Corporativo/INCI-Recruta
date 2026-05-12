import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SuperAdminDashboard from '@src/views/super-admin/SuperAdminDashboard';
import { CompanyWithStats, GlobalStats } from '@src/services/super-admin.service';

export const metadata = { title: 'Painel Global — INCI Recruta' };

async function fetchDashboardData(): Promise<{ stats: GlobalStats | null; companies: CompanyWithStats[] }> {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); } } }
        );

        const [companiesRes, jobsRes, candidatesRes, usersRes] = await Promise.all([
            supabase.from('companies').select('status'),
            supabase.from('jobs').select('id', { count: 'exact', head: true }),
            supabase.from('candidates').select('id', { count: 'exact', head: true }),
            supabase.from('users').select('id', { count: 'exact', head: true }),
        ]);

        const companyList = companiesRes.data || [];
        const stats: GlobalStats = {
            total_companies: companyList.length,
            active_companies: companyList.filter((c: any) => c.status === 'active').length,
            trial_companies: companyList.filter((c: any) => c.status === 'trial').length,
            suspended_companies: companyList.filter((c: any) => c.status === 'suspended').length,
            pending_companies: companyList.filter((c: any) => c.status === 'pending').length,
            total_jobs: jobsRes.count ?? 0,
            total_candidates: candidatesRes.count ?? 0,
            total_users: usersRes.count ?? 0,
        };

        const { data: companiesData } = await supabase
            .from('companies')
            .select(`*, members_count:company_members(count), jobs_count:jobs(count)`)
            .order('created_at', { ascending: false });

        const companies: CompanyWithStats[] = (companiesData || []).map((c: any) => ({
            ...c,
            members_count: c.members_count?.[0]?.count ?? 0,
            jobs_count: c.jobs_count?.[0]?.count ?? 0,
            candidates_count: 0,
        }));

        return { stats, companies };
    } catch {
        return { stats: null, companies: [] };
    }
}

export default async function SuperAdminDashboardPage() {
    const { stats, companies } = await fetchDashboardData();
    return <SuperAdminDashboard initialStats={stats} initialCompanies={companies} />;
}
