import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getAuthStorageConfig } from './auth-utils';

/**
 * Cria um cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Seleciona automaticamente o cookie correto baseado no pathname da requisição se fornecido.
 */
export async function getServerSupabase(pathname?: string) {
    const cookieStore = await cookies();
    const { cookieName } = getAuthStorageConfig(pathname || '/');

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                name: cookieName,
            },
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // O método setAll pode ser chamado em Server Components onde cookies não podem ser definidos.
                        // O Middleware lidará com a persistência de tokens se necessário.
                    }
                },
            },
            auth: {
                storageKey: cookieName, // Usamos o mesmo nome para consistência no server
            },
            // Configuramos o nome do cookie explicitamente se a lib permitir (depende da versão do @supabase/ssr)
            // No @supabase/ssr atual, o nome do cookie é passado no objeto global de cookies se necessário,
            // mas o getAll/setAll já lidam com isso se filtrarmos.
            // No entanto, para evitar que o Supabase use o nome padrão 'sb-auth-token', 
            // precisamos garantir que ele use o nosso.
        }
    );
}
