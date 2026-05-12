// @component tenant | @tipo lib | @versao 1.0.0
// > Helpers de contexto multi-tenant — resolve company_id do usuário autenticado
// @api getCurrentCompanyId(): retorna o company_id ativo do usuário ou null
// @api clearTenantCache(): limpa o cache (chamar no logout)

import { supabase } from '@src/lib/supabase';

let cachedCompanyId: string | null = null;
let cachedUserId: string | null = null;
let inFlight: Promise<string | null> | null = null;

/**
 * Resolve o company_id ativo do usuário autenticado a partir de company_members.
 * Mantém cache em memória por sessão para evitar round-trips.
 */
export async function getCurrentCompanyId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        cachedCompanyId = null;
        cachedUserId = null;
        return null;
    }

    if (cachedUserId === user.id && cachedCompanyId) {
        return cachedCompanyId;
    }

    if (inFlight) return inFlight;

    inFlight = (async () => {
        const timeout = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('TENANT_TIMEOUT')), 6000)
        );

        try {
            // Tenta primeiro com status=active
            const { data: member } = await Promise.race([
                supabase
                    .from('company_members')
                    .select('company_id')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .maybeSingle(),
                timeout
            ]) as any;

            let companyId = member?.company_id ?? null;

            // Fallback sem filtro de status (ex: registro existe mas status não é 'active')
            if (!companyId) {
                const { data: anyMember } = await Promise.race([
                    supabase
                        .from('company_members')
                        .select('company_id')
                        .eq('user_id', user.id)
                        .maybeSingle(),
                    timeout
                ]) as any;
                companyId = anyMember?.company_id ?? null;
            }

            cachedUserId = user.id;
            cachedCompanyId = companyId;
            return cachedCompanyId;
        } catch (e: any) {
            console.warn('[tenant] getCurrentCompanyId timeout ou erro:', e.message);
            return null;
        }
    })();

    try {
        return await inFlight;
    } finally {
        inFlight = null;
    }
}

/** Pré-popula o cache a partir do AuthContext, evitando re-query ao salvar registros. */
export function primeTenantCache(userId: string, companyId: string | null) {
    cachedUserId = userId;
    cachedCompanyId = companyId;
}

export function clearTenantCache() {
    cachedCompanyId = null;
    cachedUserId = null;
    inFlight = null;
}
