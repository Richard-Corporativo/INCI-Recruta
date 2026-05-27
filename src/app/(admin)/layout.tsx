// @component AdminLayout | @tipo layout-server | @versao 2.0.0
// > Guard server-side para rotas /admin/* — verifica sessão e role via SSR
// > A UI interativa (Sidebar, header) fica no AdminShell (client component)
// > Padrão idêntico ao (candidate)/layout.tsx para consistência

import AdminShell from '@src/components/admin/AdminShell';
import { getServerSupabase } from '@src/lib/supabase-server';
import { redirect } from 'next/navigation';

const COMPANY_ROLES = ['owner', 'admin', 'manager', 'recruiter', 'quality', 'dp'];

export const dynamic = 'force-dynamic';

export default async function AppAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const supabase = await getServerSupabase('/admin');

        const { data: { user } } = await supabase.auth.getUser();

        // Sem sessão → login com indicação de destino
        if (!user) {
            redirect('/login?type=company');
        }

        // Busca role do banco
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('role, status')
            .eq('id', user.id)
            .single();

        if (dbError) {
            console.error('[AdminLayout] Erro ao buscar role do usuário:', dbError);
        }

        // Fallback: usa metadata do Auth (definido no cadastro)
        const role = dbUser?.role || user.user_metadata?.role || 'candidate';

        // Super admin não pertence ao /admin — redireciona para o painel correto
        if (role === 'super_admin') {
            redirect('/super-admin/dashboard');
        }

        const isCompanyRole = COMPANY_ROLES.includes(role);

        // Candidato tentando acessar área admin → vai para o painel do candidato
        if (!isCompanyRole) {
            redirect('/candidate/dashboard');
        }

        return <AdminShell>{children}</AdminShell>;

    } catch (error: any) {
        // Re-lança redirects do Next.js para que funcionem corretamente
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('[AdminLayout] Erro crítico:', error);
        redirect('/login?type=company');
    }
}
