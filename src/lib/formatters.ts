// @component Formatters | @tipo lib | @versao 1.0.0
// > Formatadores centralizados (moeda, data, telefone)
// @api formatCurrency(val): string, formatSalaryRange(min, max): string, formatDate(date): string, formatPhone(phone): string
// @rule Moeda BRL, datas pt-BR, telefone (XX) XXXXX-XXXX

export const formatCurrency = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null || value === 0) return '';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) return '';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numValue);
};

export const formatSalaryRange = (min: number | string | undefined | null, max: number | string | undefined | null): string => {
    const formattedMin = formatCurrency(min);
    const formattedMax = formatCurrency(max);

    if (formattedMin && formattedMax) {
        return `${formattedMin} - ${formattedMax}`;
    }

    if (formattedMin) return formattedMin;
    if (formattedMax) return formattedMax;

    return 'A combinar';
};

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const parseDate = (date: string | Date | undefined | null): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return Number.isNaN(date.getTime()) ? null : date;

    const dateOnlyMatch = DATE_ONLY_RE.exec(date);
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0, 0);
    }

    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (
    date: string | Date | undefined | null,
    options?: Intl.DateTimeFormatOptions,
    fallback = '-'
): string => {
    const parsed = parseDate(date);
    if (!parsed) return fallback;
    return parsed.toLocaleDateString('pt-BR', options);
};

export const formatDateTime = (
    date: string | Date | undefined | null,
    options?: Intl.DateTimeFormatOptions,
    fallback = '-'
): string => {
    const parsed = parseDate(date);
    if (!parsed) return fallback;
    return parsed.toLocaleString('pt-BR', options);
};

export const isExpiredDate = (date: string | Date | undefined | null, reference = new Date()): boolean => {
    const parsed = parseDate(date);
    if (!parsed) return false;

    const raw = typeof date === 'string' ? date : '';
    const isDateOnly = DATE_ONLY_RE.test(raw);
    const end = new Date(parsed);
    if (isDateOnly) end.setHours(23, 59, 59, 999);

    return reference.getTime() > end.getTime();
};

export const formatJobId = (jobNumber?: number | null): string => {
    if (!jobNumber) return '';
    return `ID #${String(jobNumber).padStart(4, '0')}`;
};

export const formatPhone = (phone: string | undefined | null): string => {
    if (!phone) return '-';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
};
