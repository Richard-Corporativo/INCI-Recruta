import { createBrowserClient } from '@supabase/ssr';
import { getAuthStorageConfig } from './auth-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cache de instâncias para evitar recriar o cliente a cada acesso de propriedade
const clients: Record<string, any> = {};

/**
 * Retorna a instância do Supabase correta para o caminho atual.
 * No Browser, detecta automaticamente via window.location.
 */
export const getSupabaseBrowser = () => {
    if (typeof window === 'undefined') {
        // Fallback básico para SSR se alguém importar este arquivo no servidor acidentalmente
        return createBrowserClient(supabaseUrl, supabaseAnonKey);
    }

    const { type, cookieName, storageKey } = getAuthStorageConfig(
        window.location.pathname,
        new URLSearchParams(window.location.search)
    );

    if (!clients[type]) {
        clients[type] = createBrowserClient(supabaseUrl, supabaseAnonKey, {
            cookieOptions: {
                name: cookieName,
            },
            auth: {
                storageKey: storageKey,
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    }

    return clients[type];
};

/**
 * Proxy transparente para a instância atual do Supabase.
 * Permite que o código existente `import { supabase } from '@/lib/supabase'` continue funcionando,
 * mas aponte para o cliente correto do contexto atual (admin, candidate, super-admin).
 */
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
    get(_, prop) {
        const client = getSupabaseBrowser();
        const value = (client as any)[prop];
        if (typeof value === 'function') {
            return value.bind(client);
        }
        return value;
    }
});
