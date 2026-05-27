'use client';

// @component Router Compat Layer | @tipo lib | @versao 1.0.0
// > Ponte react-router-dom → next/navigation para migração gradual

import { useRouter as useNextRouter, useParams as useNextParams, usePathname } from 'next/navigation';
import NextLink from 'next/link';
import React, { useCallback, useMemo } from 'react';

// ─── useNavigate ────────────────────────────────────────────────────────────
export function useNavigate() {
    const router = useNextRouter();

    return useCallback((to: string | number, options?: { replace?: boolean; state?: unknown }) => {
        if (typeof to === 'number') {
            if (to === -1) router.back();
            else router.forward();
            return;
        }

        if (options?.replace) {
            router.replace(to);
        } else {
            router.push(to);
        }
    }, [router]);
}

// ─── useLocation ────────────────────────────────────────────────────────────
export function useLocation() {
    const pathname = usePathname();

    return useMemo(() => ({
        pathname,
        search: typeof window !== 'undefined' ? window.location.search : '',
        hash: typeof window !== 'undefined' ? window.location.hash : '',
        state: null as unknown,
        key: 'default',
    }), [pathname]);
}

// ─── useParams ──────────────────────────────────────────────────────────────
export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
    const params = useNextParams();
    return (params ?? {}) as T;
}

// ─── Link ───────────────────────────────────────────────────────────────────
interface LinkProps extends Omit<React.ComponentProps<typeof NextLink>, 'href'> {
    to: string;
    replace?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ to, replace, children, ...props }, ref) => {
        return (
            <NextLink href={to} replace={replace} ref={ref} {...props}>
                {children}
            </NextLink>
        );
    }
);
Link.displayName = 'Link';

// ─── Navigate (redirect component) ─────────────────────────────────────────
interface NavigateProps {
    to: string;
    replace?: boolean;
}

export function Navigate({ to, replace: doReplace = false }: NavigateProps) {
    const router = useNextRouter();

    React.useEffect(() => {
        if (doReplace) {
            router.replace(to);
        } else {
            router.push(to);
        }
    }, [to, doReplace, router]);

    return null;
}

// ─── Outlet placeholder ────────────────────────────────────────────────────
// Em App Router, {children} substitui <Outlet />.
// Este export existe apenas para facilitar grep de uso restante.
export function Outlet() {
    console.warn('[router-compat] <Outlet /> não existe no App Router. Use {children} no layout.');
    return null;
}
