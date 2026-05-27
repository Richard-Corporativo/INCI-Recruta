import { createServerClient } from '@supabase/ssr'; // HMR_FORCE_RELOAD_01
import { NextResponse, type NextRequest } from 'next/server';
import { getAuthStorageConfig } from './lib/auth-utils';

// Roles que têm acesso ao painel administrativo
const COMPANY_ROLES = ['owner', 'admin', 'manager', 'recruiter', 'quality', 'dp'];

export async function middleware(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.next();
        }

        const { pathname, searchParams } = request.nextUrl;
        const { cookieName } = getAuthStorageConfig(pathname, searchParams);

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
                cookieOptions: {
                    name: cookieName,
                },
                auth: {
                    storageKey: cookieName,
                }
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

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
                if (pathname.startsWith('/admin')) {
                    loginUrl.searchParams.set('type', 'company');
                } else if (pathname.startsWith('/super-admin')) {
                    loginUrl.searchParams.set('type', 'super-admin');
                }
                return NextResponse.redirect(loginUrl);
            }

            return supabaseResponse;
        }

        // ── Com sessão: buscar role no banco ─────────────────────────────────
        let dbUser: any = null;
        const { data, error: dbError } = await supabase
            .from('users')
            .select('role, status, phone')
            .eq('id', user.id)
            .maybeSingle();
        dbUser = data;

        const dbFailed = dbError || dbUser === null;

        // Fallback: usa metadata do Auth apenas se banco falhou
        // SEGURANÇA: se banco falhou e rota é super-admin, rejeita acesso
        if (dbFailed && pathname.startsWith('/super-admin')) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('type', 'super-admin');
            loginUrl.searchParams.set('next', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (dbFailed && dbError) {
            console.warn('[Middleware] Banco falhou, usando metadata como fallback:', {
                pathname,
                userId: user.id,
                errorCode: (dbError as any)?.code ?? 'unknown',
            });
        }

        const role = dbUser?.role || user.user_metadata?.role || 'candidate';
        const status = dbUser?.status ?? 'active';
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
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('type', 'super-admin');
            loginUrl.searchParams.set('next', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // ── Regras de Redirecionamento ────────────────────────────────────────

        // Logado e em /login → redireciona para dashboard correto
        if (pathname === '/login') {
            if (isCompanyUser && isActive) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            if (!isCompanyUser && isActive) return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
        }

        // Logado e tentando acessar cadastro direto de empresa/candidato → redireciona se já tiver role
        if (pathname === '/cadastro/empresa' || pathname === '/cadastro/candidato') {
            if (isCompanyUser && isActive) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            if (!isCompanyUser && pathname === '/cadastro/candidato' && isActive) {
                 return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
            }
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

        // Candidato com perfil incompleto tentando candidatar (checa se tem telefone)
        if (isApplicationRoute && !isCompanyUser && dbUser !== null && !dbUser.phone) {
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
            if (pathname.startsWith('/admin')) {
                loginUrl.searchParams.set('type', 'company');
            } else if (pathname.startsWith('/super-admin')) {
                loginUrl.searchParams.set('type', 'super-admin');
            }
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
