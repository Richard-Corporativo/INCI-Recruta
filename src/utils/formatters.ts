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
