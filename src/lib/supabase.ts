// @component SupabaseClient | @tipo lib | @versao 1.1.0
// > Instância singleton do cliente Supabase otimizada para SSR
// @rule Usa createBrowserClient para sincronização automática de cookies

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase credentials not found. Check your .env file.'
    );
}

// createBrowserClient gerencia automaticamente a persistência em Cookies
// necessária para que o Middleware do Next.js funcione corretamente.
export const supabase = createBrowserClient(
    supabaseUrl || 'https://invalid-project.supabase.co',
    supabaseAnonKey || 'invalid-anon-key'
);
