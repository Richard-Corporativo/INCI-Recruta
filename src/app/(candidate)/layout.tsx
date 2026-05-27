// @component CandidateLayout | @tipo layout | @versao 1.0.0
// > Layout de rotas candidato — proteção, CandidateLayout, verificação auth
// @calls useAuth — verificação de autenticação

/**
 * Candidate routes layout — (candidate)
 * 
 * Rotas protegidas: /candidate/dashboard, /candidate/applications, /candidate/settings
 * 
 * Migrar CandidateLayout.tsx + RequireCandidateAuth guard.
 * Auth guard migra para src/middleware.ts (server-side).
 */

import CandidateLayout from '@src/layouts/CandidateLayout';
import { getServerSupabase } from '@src/lib/supabase-server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AppCandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const supabase = await getServerSupabase('/candidate');

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect('/login?next=/candidate/dashboard');
        }

        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (dbError) {
            console.error('[CandidateLayout] Erro ao buscar role do usuário:', dbError);
            // Assume candidato se não conseguir buscar (graceful fallback)
        }

        const role = dbUser?.role || 'candidate';
        if (role !== 'candidate') {
            redirect('/admin/dashboard');
        }

        return <CandidateLayout>{children}</CandidateLayout>;
    } catch (error: any) {
        // Importante: Re-lançar erros de redirecionamento do Next.js para que funcionem corretamente
        if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('[CandidateLayout] Erro crítico:', error);
        // Se alguma outra coisa falhar, redireciona para login
        redirect('/login?next=/candidate/dashboard');
    }
}
