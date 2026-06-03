import { supabase } from '@src/lib/supabase';
import { Company, Job, Role, Candidate, AuditLog, PaginatedResult } from '@src/types';

type CompanyLookup = { id: string; name: string | null; slug?: string | null };

export interface CompanyWithStats extends Company {
    members_count: number;
    jobs_count: number;
    candidates_count: number;
}

export interface MemberWithUser {
    id: string;
    user_id: string;
    role: string;
    status: string;
    joined_at: string | null;
    created_at: string;
    name: string;
    email: string;
}

export interface CompanyDetails extends Company {
    members_count: number;
    jobs_count: number;
    owner_name: string | null;
    owner_email: string | null;
}

export interface GlobalStats {
    total_companies: number;
    active_companies: number;
    trial_companies: number;
    suspended_companies: number;
    pending_companies: number;
    total_jobs: number;
    total_candidates: number;
    total_users: number;
}

export async function getAllCompanies(): Promise<CompanyWithStats[]> {
    const { data, error } = await supabase
        .from('companies')
        .select(`
            *,
            members_count:company_members(count),
            jobs_count:jobs(count)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((c: any) => ({
        ...c,
        members_count: c.members_count?.[0]?.count ?? 0,
        jobs_count: c.jobs_count?.[0]?.count ?? 0,
        candidates_count: 0,
    }));
}

export async function getGlobalStats(): Promise<GlobalStats> {
    const [companiesRes, jobsRes, candidatesRes, usersRes] = await Promise.all([
        supabase.from('companies').select('status'),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('candidates').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
    ]);

    const companies = companiesRes.data || [];

    return {
        total_companies: companies.length,
        active_companies: companies.filter((c: any) => c.status === 'active').length,
        trial_companies: companies.filter((c: any) => c.status === 'trial').length,
        suspended_companies: companies.filter((c: any) => c.status === 'suspended').length,
        pending_companies: companies.filter((c: any) => c.status === 'pending').length,
        total_jobs: jobsRes.count ?? 0,
        total_candidates: candidatesRes.count ?? 0,
        total_users: usersRes.count ?? 0,
    };
}

export async function updateCompanyStatus(
    companyId: string,
    status: Company['status']
): Promise<void> {
    const { error } = await supabase
        .from('companies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', companyId);

    if (error) throw error;
}

export async function getCompanyDetails(id: string): Promise<CompanyDetails | null> {
    const { data: company, error } = await supabase
        .from('companies')
        .select(`
            *,
            members_count:company_members(count),
            jobs_count:jobs(count)
        `)
        .eq('id', id)
        .maybeSingle();

    if (error || !company) return null;

    // Busca o owner (membro com role = 'owner')
    const { data: ownerMember } = await supabase
        .from('company_members')
        .select('user_id')
        .eq('company_id', id)
        .eq('role', 'owner')
        .maybeSingle();

    let owner_name: string | null = null;
    let owner_email: string | null = null;

    if (ownerMember?.user_id) {
        const { data: ownerUser } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', ownerMember.user_id)
            .maybeSingle();

        owner_name = ownerUser?.name ?? null;
        owner_email = ownerUser?.email ?? null;
    }

    return {
        ...company,
        members_count: company.members_count?.[0]?.count ?? 0,
        jobs_count: company.jobs_count?.[0]?.count ?? 0,
        owner_name,
        owner_email,
    } as CompanyDetails;
}

export async function getCompanyMembers(companyId: string): Promise<MemberWithUser[]> {
    const { data: members, error } = await supabase
        .from('company_members')
        .select('id, user_id, role, status, joined_at, created_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

    if (error || !members) return [];

    const userIds = members.map(m => m.user_id).filter(Boolean);
    if (userIds.length === 0) return [];

    const { data: users } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', userIds);

    const userMap = new Map(
        ((users ?? []) as Array<{ id: string; name: string | null; email: string | null }>)
            .map(u => [u.id, u])
    );

    return members.map(m => {
        const u = userMap.get(m.user_id);
        return {
            ...m,
            name: u?.name ?? '—',
            email: u?.email ?? '—',
        };
    });
}

export async function deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// ── Cross-tenant types ────────────────────────────────────────────────────────

export interface JobWithCompany extends Job {
    company_name: string;
    company_slug: string;
}

export interface RoleWithCompany extends Role {
    company_id: string;
    company_name: string;
}

export interface CandidateWithCompany extends Candidate {
    company_name: string;
}

export interface AuditLogWithCompany extends AuditLog {
    company_name: string;
}

// ── Cross-tenant queries ──────────────────────────────────────────────────────

async function assertSuperAdmin(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
    if (profile?.role !== 'super_admin') {
        throw new Error('Acesso negado: requer super_admin');
    }
}

export async function getAllJobsCrossTenant(
    { page = 1, pageSize = 50 }: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<JobWithCompany>> {
    await assertSuperAdmin();
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) return { data: [], total: count ?? 0, page, pageSize };

    const companyIds = [...new Set(data.map((j: any) => j.company_id).filter(Boolean))];
    const { data: companies } = await supabase
        .from('companies')
        .select('id, name, slug')
        .in('id', companyIds);

    const companyMap = new Map(((companies ?? []) as CompanyLookup[]).map(c => [c.id, c]));

    return {
        data: data.map((j: any) => {
            const company = companyMap.get(j.company_id);
            return {
                ...j,
                candidates_count: j.candidates_count ?? 0,
                company_name: company?.name ?? '—',
                company_slug: company?.slug ?? '',
            };
        }),
        total: count ?? 0,
        page,
        pageSize,
    };
}

export async function getAllRolesCrossTenant(
    { page = 1, pageSize = 50 }: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<RoleWithCompany>> {
    await assertSuperAdmin();
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('roles')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) return { data: [], total: count ?? 0, page, pageSize };

    const companyIds = [...new Set(data.map((r: any) => r.company_id).filter(Boolean))];
    const { data: companies } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', companyIds);

    const companyMap = new Map(((companies ?? []) as CompanyLookup[]).map(c => [c.id, c]));

    return {
        data: data.map((r: any) => ({
            ...r,
            open_positions: r.open_positions ?? 0,
            company_name: companyMap.get(r.company_id)?.name ?? '—',
        })),
        total: count ?? 0,
        page,
        pageSize,
    };
}

export async function getAllCandidatesCrossTenant(
    { page = 1, pageSize = 50 }: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<CandidateWithCompany>> {
    await assertSuperAdmin();
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('candidates')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) return { data: [], total: count ?? 0, page, pageSize };

    const companyIds = [...new Set(data.map((c: any) => c.company_id).filter(Boolean))];
    const { data: companies } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', companyIds);

    const companyMap = new Map(((companies ?? []) as CompanyLookup[]).map(c => [c.id, c]));

    return {
        data: data.map((c: any) => ({
            ...c,
            company_name: companyMap.get(c.company_id)?.name ?? '—',
        })),
        total: count ?? 0,
        page,
        pageSize,
    };
}

export async function getAllAuditLogsCrossTenant(
    { page = 1, pageSize = 50 }: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<AuditLogWithCompany>> {
    await assertSuperAdmin();
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) return { data: [], total: count ?? 0, page, pageSize };

    const companyIds = [...new Set(data.map((l: any) => l.company_id).filter(Boolean))];
    const { data: companies } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', companyIds);

    const companyMap = new Map(((companies ?? []) as CompanyLookup[]).map(c => [c.id, c]));

    return {
        data: data.map((l: any) => ({
            ...l,
            company_name: companyMap.get(l.company_id)?.name ?? '—',
        })),
        total: count ?? 0,
        page,
        pageSize,
    };
}
