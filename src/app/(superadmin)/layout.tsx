import { getServerSupabase } from '@src/lib/supabase-server';
import { redirect } from 'next/navigation';
import SuperAdminShell from '@src/components/super-admin/SuperAdminShell';

export const dynamic = 'force-dynamic';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    try {
        const supabase = await getServerSupabase('/super-admin');

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect('/login?type=super-admin&next=/super-admin/dashboard');

        const { data: dbUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        // Usa apenas o role do banco — metadata pode estar desatualizado
        if (dbUser?.role !== 'super_admin') redirect('/login?type=super-admin&next=/super-admin/dashboard');

        return <SuperAdminShell>{children}</SuperAdminShell>;

    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
        redirect('/login?type=super-admin&next=/super-admin/dashboard');
    }
}
