/// <reference types="node" />
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Roles que têm acesso ao painel administrativo
const COMPANY_ROLES = ['owner', 'admin', 'manager', 'recruiter', 'quality', 'dp'];

export async function middleware(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.next();
        }

        let supabaseResponse = NextResponse.next({ request });

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                        supabaseResponse = NextResponse.next({ request });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const { pathname } = request.nextUrl;

        // ── Redirecionar rota legada de login admin ──────────────────────────
        if (pathname === '/admin/login') {
            return NextResponse.redirect(new URL('/login?type=company', request.url));
        }

        // ── Sem sessão: proteger rotas autenticadas ──────────────────────────
        if (!user) {
            const isApplicationRoute = /^\/vagas\/[^/]+\/[^/]+\/candidatar$/.test(pathname);
            const isProtectedRoute =
                pathname.startsWith('/admin') ||
                pathname.startsWith('/super-admin') ||
                pathname.startsWith('/candidate') ||
                pathname.startsWith('/perfil') ||
                isApplicationRoute;

            if (isProtectedRoute) {
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('next', pathname);
                return NextResponse.redirect(loginUrl);
            }

            return supabaseResponse;
        }

        // ── Com sessão: buscar role no banco ─────────────────────────────────
        let dbUser: any = null;
        const { data } = await supabase
            .from('users')
            .select('role, status, profile_status')
            .eq('id', user.id)
            .maybeSingle();
        dbUser = data;

        // Fallback: usa metadata do Auth (definido no cadastro) se banco falhar
        const role = dbUser?.role || user.user_metadata?.role || 'candidate';
        const status = dbUser?.status ?? 'active';
        const profileStatus = dbUser?.profile_status;
        const isSuperAdmin = role === 'super_admin';
        const isCompanyUser = COMPANY_ROLES.includes(role);
        const isActive = status === 'active';
        const isApplicationRoute = /^\/vagas\/[^/]+\/[^/]+\/candidatar$/.test(pathname);

        // ── Super Admin: acesso exclusivo ao /super-admin/* ───────────────────

        // Super admin logado em auth pública → super-admin dashboard
        if (isSuperAdmin && (pathname === '/login' || pathname === '/cadastro')) {
            return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
        }

        // Super admin não deve acessar rotas de empresa ou candidato
        if (isSuperAdmin && (pathname.startsWith('/admin') || pathname.startsWith('/candidate'))) {
            return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
        }

        // Não-super_admin tentando acessar área super-admin → login
        if (pathname.startsWith('/super-admin') && !isSuperAdmin) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // ── Regras de Redirecionamento ────────────────────────────────────────

        // Logado e em página de auth pública → redireciona para o dashboard correto
        if (pathname === '/login' || pathname === '/cadastro' ||
            pathname === '/cadastro/empresa' || pathname === '/cadastro/candidato') {
            if (isCompanyUser && isActive) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            // Candidatos: não redireciona de cadastro (deixa ver a confirmação)
            if (pathname === '/login') {
                return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
            }
            return supabaseResponse;
        }

        // Empresa tentando acessar área de candidato → admin dashboard
        if (pathname.startsWith('/candidate') && isCompanyUser && isActive) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        // Candidato tentando acessar área admin → painel do candidato
        if (pathname.startsWith('/admin') && !isCompanyUser) {
            return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
        }

        // Empresa inativa/pendente tentando acessar admin → login
        if (pathname.startsWith('/admin') && isCompanyUser && !isActive) {
            return NextResponse.redirect(new URL('/login?type=company', request.url));
        }

        // Candidatura: empresa não pode candidatar
        if (isApplicationRoute && isCompanyUser && isActive) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        // Candidato com perfil incompleto tentando candidatar
        if (isApplicationRoute && !isCompanyUser && profileStatus === 'incomplete') {
            const completeProfileUrl = new URL('/perfil/completar', request.url);
            completeProfileUrl.searchParams.set('next', pathname);
            return NextResponse.redirect(completeProfileUrl);
        }

        return supabaseResponse;

    } catch (error) {
        const { pathname } = request.nextUrl;

        console.error('[Middleware] Erro:', {
            pathname,
            error: error instanceof Error ? error.message : String(error),
        });

        const isApplicationRoute = /^\/vagas\/[^/]+\/[^/]+\/candidatar$/.test(pathname);
        const isProtectedRoute =
            pathname.startsWith('/admin') ||
            pathname.startsWith('/super-admin') ||
            pathname.startsWith('/candidate') ||
            pathname.startsWith('/perfil') ||
            isApplicationRoute;

        if (isProtectedRoute) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('next', pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
