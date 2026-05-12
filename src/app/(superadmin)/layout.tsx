import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SuperAdminShell from '@src/components/super-admin/SuperAdminShell';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); } } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect('/login');

        const { data: dbUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        // Usa apenas o role do banco — metadata pode estar desatualizado
        if (dbUser?.role !== 'super_admin') redirect('/');

        return <SuperAdminShell>{children}</SuperAdminShell>;

    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
        redirect('/login');
    }
}
