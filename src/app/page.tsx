import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function HomePage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

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
