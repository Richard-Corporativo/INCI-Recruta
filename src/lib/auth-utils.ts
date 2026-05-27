/**
 * Utilitários de autenticação para suportar múltiplos logins simultâneos.
 * Define o nome do cookie e a chave de storage com base no caminho da URL.
 */

export const getAuthStorageConfig = (path: string, searchParams?: URLSearchParams) => {
    let type = 'candidate'; // Default para áreas públicas e de candidato
    
    // 1. Verificar prefixo do caminho
    if (path.startsWith('/admin') || path === '/cadastro/empresa') {
        type = 'admin';
    } else if (path.startsWith('/super-admin')) {
        type = 'super-admin';
    } else if (path.startsWith('/candidate') || path === '/cadastro/candidato') {
        type = 'candidate';
    } 
    // 2. Verificar query params (especialmente em /login ou /cadastro)
    else {
        const params = searchParams || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null);
        if (params) {
            const typeParam = params.get('type');
            const nextParam = params.get('next');
            
            if (typeParam === 'company' || nextParam?.startsWith('/admin')) {
                type = 'admin';
            } else if (typeParam === 'super-admin' || nextParam?.startsWith('/super-admin')) {
                type = 'super-admin';
            }
        }
    }

    const cookieName = `sb-${type}-auth-token`;
    const storageKey = `sb-${type}-auth-token`;

    return { type, cookieName, storageKey };
};
