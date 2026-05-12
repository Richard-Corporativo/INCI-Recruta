// @component Navigation Helpers | @tipo lib | @versao 1.0.0
// > Helpers seguros para redirecionamentos internos

export const getSafeNextPath = (next: string | null | undefined, fallback = '/candidate/dashboard'): string => {
    if (!next) return fallback;

    const decoded = decodeURIComponent(next);
    const isInternalPath = decoded.startsWith('/') && !decoded.startsWith('//');
    const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(decoded);
    const hasBackslash = decoded.includes('\\');

    if (!isInternalPath || hasProtocol || hasBackslash) return fallback;

    return decoded;
};

export const withNextParam = (path: string, next: string | null | undefined): string => {
    const safeNext = getSafeNextPath(next, '');
    if (!safeNext) return path;

    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}next=${encodeURIComponent(safeNext)}`;
};
