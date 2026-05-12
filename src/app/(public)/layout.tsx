// @component PublicLayout | @tipo layout | @versao 1.0.0
// > Layout de rotas públicas — sem proteção, wrapper genérico

/**
 * Public routes layout — (public)
 * 
 * Rotas: /vagas, /login, /cadastro, /recuperar-senha, /termos, /privacidade
 * 
 * Migrar PublicLayout.tsx de react-router-dom para next/link + next/navigation.
 * Substituir <Outlet /> por {children}.
 * Substituir useNavigate() por useRouter().
 * Substituir <Link to=""> por <Link href="">.
 */

import PublicLayout from '@src/layouts/PublicLayout';

export default function AppPublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PublicLayout>{children}</PublicLayout>;
}
