/// <reference types="node" />
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.next();
        }

        let supabaseResponse = NextResponse.next({
            request,
        });

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                        supabaseResponse = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // getUser é essencial para validar a sessão
        const { data: { user } } = await supabase.auth.getUser();

        const { pathname } = request.nextUrl;

        // Proteção baseada em fonte confiável (DB)
        let dbUser: any = null;
        if (user?.id) {
            const { data } = await supabase
                .from('users')
                .select('role, status')
                .eq('id', user.id)
                .single();
            dbUser = data;
        }

        const role = dbUser?.role ?? 'candidate';
        const status = dbUser?.status ?? 'pending_approval';
        const companyRoles = ['admin', 'manager', 'recruiter', 'quality', 'dp'];
        const isCompanyUser = companyRoles.includes(role);
        const isActive = status === 'active';

        // Regras de Redirecionamento
        if (user) {
            // Se logado e na página de auth, manda pro dashboard correspondente
            if (pathname === '/login' || pathname === '/cadastro') {
                const dest = (isCompanyUser && isActive) ? '/admin/dashboard' : '/candidate/dashboard';
                return NextResponse.redirect(new URL(dest, request.url));
            }

            // Proteção Cruzada e Bloqueio de Inativos/Pendentes
            if (pathname.startsWith('/admin')) {
                if (!isCompanyUser || !isActive) {
                    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
                }
            }

            if (pathname.startsWith('/candidate') && isCompanyUser && isActive) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        } else {
            // Se deslogado e em rota protegida, manda pro login
            const isProtectedRoute = 
                pathname.startsWith('/admin') || 
                pathname.startsWith('/candidate') || 
                pathname.startsWith('/perfil');

            if (isProtectedRoute) {
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('next', pathname);
                return NextResponse.redirect(loginUrl);
            }
        }

        return supabaseResponse;
    } catch (error) {
        // Log básico no servidor para debug
        console.error('Middleware execution error:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - all.css, etc.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
