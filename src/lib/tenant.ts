// @component tenant | @tipo lib | @versao 1.1.0
// > Helpers de contexto multi-tenant — resolve company_id do usuário autenticado
// @api getCurrentCompanyId(): retorna o company_id ativo do usuário ou null
// @api clearTenantCache(): limpa o cache (chamar no logout)

import { supabase } from '@src/lib/supabase';

// Cache em memória apenas para o CLIENTE (browser)
// No servidor (Next.js), variáveis de módulo são compartilhadas entre requisições.
const isBrowser = typeof window !== 'undefined';
let clientCachedCompanyId: string | null = null;
let clientCachedUserId: string | null = null;
let clientInFlight: Promise<string | null> | null = null;

/**
 * Resolve o company_id ativo do usuário autenticado a partir de company_members.
 * No cliente, mantém cache em memória. No servidor, busca sempre do Supabase (que usa cookies).
 */
export async function getCurrentCompanyId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        if (isBrowser) {
            clientCachedCompanyId = null;
            clientCachedUserId = null;
        }
        return null;
    }

    // Se estiver no browser, usa o cache local
    if (isBrowser && clientCachedUserId === user.id && clientCachedCompanyId) {
        return clientCachedCompanyId;
    }

    if (isBrowser && clientInFlight) return clientInFlight;

    const fetchPromise = (async () => {
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

            // Sem fallback para user_metadata: metadados podem ser forjados pelo cliente
            // via supabase.auth.updateUser(), permitindo cross-tenant access. Falha fechado.

            if (isBrowser) {
                clientCachedUserId = user.id;
                clientCachedCompanyId = companyId;
            }
            return companyId;
        } catch (e: any) {
            // Falha fechado: não usa user_metadata como fallback pois pode ser forjado
            // pelo cliente. Em caso de indisponibilidade do DB, os call sites tratam null.
            console.warn('[tenant] getCurrentCompanyId timeout ou erro:', e.message);
            return null;
        }
    })();

    if (isBrowser) {
        clientInFlight = fetchPromise;
        try {
            return await clientInFlight;
        } finally {
            clientInFlight = null;
        }
    }

    return await fetchPromise;
}

/** Pré-popula o cache a partir do AuthContext (Client Side only). */
export function primeTenantCache(userId: string, companyId: string | null) {
    if (isBrowser) {
        clientCachedUserId = userId;
        clientCachedCompanyId = companyId;
    }
}

export function clearTenantCache() {
    if (isBrowser) {
        clientCachedCompanyId = null;
        clientCachedUserId = null;
        clientInFlight = null;
    }
}

