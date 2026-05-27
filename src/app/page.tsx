import { redirect } from 'next/navigation';
import { getServerSupabase } from '@src/lib/supabase-server';

export default async function HomePage() {
    const supabase = await getServerSupabase('/');

    let targetPath = '/vagas';
    let authUser: { id: string } | null = null;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        authUser = user;

        if (authUser) {
            const { data: dbUser } = await supabase
                .from('users')
                .select('role')
                .eq('id', authUser.id)
                .single();

            if (dbUser?.role === 'super_admin') {
                targetPath = '/super-admin/dashboard';
            } else if (dbUser?.role === 'candidate') {
                targetPath = '/candidate/dashboard';
            } else {
                targetPath = '/admin/dashboard';
            }
        }
    } catch (error) {
        console.error('[HomePage] Erro ao autenticar:', error);
    }

    redirect(targetPath);
}
