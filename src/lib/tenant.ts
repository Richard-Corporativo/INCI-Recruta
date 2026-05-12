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
        const { data: member } = await supabase
            .from('company_members')
            .select('company_id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();

        cachedUserId = user.id;
        cachedCompanyId = member?.company_id ?? null;
        return cachedCompanyId;
    })();

    try {
        return await inFlight;
    } finally {
        inFlight = null;
    }
}

export function clearTenantCache() {
    cachedCompanyId = null;
    cachedUserId = null;
    inFlight = null;
}
