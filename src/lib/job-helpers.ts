// @component Job Helpers | @tipo lib | @versao 1.0.0
// > Mapeamento de ícones de benefícios e transformação de job
import { formatDate } from '@src/lib/formatters';

export const BENEFIT_ICON_MAP: Record<string, string> = {
    // Health & Wellness
    'saúde': 'favorite',
    'plano de saúde': 'favorite',
    'assistência médica': 'favorite',
    'odontológico': 'dentistry',
    'plano odontológico': 'dentistry',

    // Food & Meal
    'alimentação': 'restaurant',
    'refeição': 'restaurant',
    'vale-refeição': 'restaurant',
    'vale-alimentação': 'restaurant',
    'vr': 'restaurant',
    'va': 'restaurant',

    // Transportation
    'transporte': 'directions_bus',
    'vale-transporte': 'directions_bus',
    'vt': 'directions_bus',

    // Fitness
    'gym': 'fitness_center',
    'academia': 'fitness_center',
    'gympass': 'fitness_center',
    'wellhub': 'fitness_center',

    // Remote & Flexibility
    'remoto': 'home_work',
    'home office': 'home_work',
    'auxílio home office': 'home_work',
    'híbrido': 'home_work',
    'trabalho remoto': 'home_work',

    // Time & Schedule
    'flexível': 'schedule',
    'horário flexível': 'schedule',
    'flexibilidade': 'schedule',

    // Education & Development
    'educação': 'school',
    'cursos': 'school',
    'treinamento': 'school',
    'desenvolvimento': 'school',

    // Default fallback
    'default': 'star'
};

export const getBenefitIcon = (benefitText: string): string => {
    const normalized = benefitText.toLowerCase().trim();

    // Try exact match first
    if (BENEFIT_ICON_MAP[normalized]) {
        return BENEFIT_ICON_MAP[normalized];
    }

    // Try partial match
    for (const [key, icon] of Object.entries(BENEFIT_ICON_MAP)) {
        if (normalized.includes(key)) {
            return icon;
        }
    }

    // Fallback
    return BENEFIT_ICON_MAP['default'];
};

export const BENEFIT_COLOR_CLASS_MAP: Record<string, string> = {
    verde: 'bg-[#008000]/10 text-[#008000] border-[#008000]/20',
    'verde-claro': 'bg-[#90EE90]/10 text-[#006400] border-[#90EE90]/20',
    azul: 'bg-[#0000FF]/10 text-[#0000FF] border-[#0000FF]/20',
    'azul-claro': 'bg-[#ADD8E6]/10 text-[#00008B] border-[#ADD8E6]/20',
    roxo: 'bg-[#800080]/10 text-[#800080] border-[#800080]/20',
    lilas: 'bg-[#C8A2C8]/10 text-[#4B0082] border-[#C8A2C8]/20',
    vermelho: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/20',
    'vermelho-claro': 'bg-[#FF7F7F]/10 text-[#8B0000] border-[#FF7F7F]/20',
    laranja: 'bg-orange-100/70 text-orange-700 border-orange-200/80',
    teal: 'bg-teal-100/70 text-teal-700 border-teal-200/80',
    emerald: 'bg-emerald-100/70 text-emerald-700 border-emerald-200/80',
    sky: 'bg-sky-100/70 text-sky-700 border-sky-200/80',
    violet: 'bg-violet-100/70 text-violet-700 border-violet-200/80',
    rose: 'bg-rose-100/70 text-rose-700 border-rose-200/80',
    amber: 'bg-amber-100/70 text-amber-700 border-amber-200/80',
    cyan: 'bg-cyan-100/70 text-cyan-700 border-cyan-200/80',
    lime: 'bg-lime-100/70 text-lime-700 border-lime-200/80',
    fuchsia: 'bg-fuchsia-100/70 text-fuchsia-700 border-fuchsia-200/80',
    indigo: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/80',
    amarelo: 'bg-yellow-100/70 text-yellow-700 border-yellow-200/80',
    pink: 'bg-pink-100/70 text-pink-700 border-pink-200/80',
};

export const getBenefitColorClass = (colorId?: string): string => {
    return BENEFIT_COLOR_CLASS_MAP[colorId || 'verde'] || BENEFIT_COLOR_CLASS_MAP.verde;
};

const tryParseJsonArray = (s: string): string[] | null => {
    const trimmed = s.trim();
    if (!(trimmed.startsWith('[') && trimmed.endsWith(']'))) return null;
    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v ?? '').trim()).filter(Boolean);
    } catch {
        // ignore
    }
    return null;
};

const toStringArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
        // Caso seja array com 1 elemento que é JSON-stringified, desempacota
        if (value.length === 1 && typeof value[0] === 'string') {
            const parsed = tryParseJsonArray(value[0]);
            if (parsed) return parsed;
        }
        return value
            .flatMap((v) => {
                if (typeof v !== 'string') return [String(v ?? '')];
                const parsed = tryParseJsonArray(v);
                return parsed ?? [v];
            })
            .map((v) => v.trim())
            .filter(Boolean);
    }
    if (typeof value === 'string') {
        const parsed = tryParseJsonArray(value);
        if (parsed) return parsed;
        return value.split('\n').map((v) => v.replace(/^- /, '').trim()).filter(Boolean);
    }
    return [];
};

const uniqueItems = (items: string[]): string[] => {
    const seen = new Set<string>();
    return items.filter((item) => {
        const key = item.trim().toLocaleLowerCase('pt-BR');
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

export const mapJobToDetail = (found: any) => {
    if (!found) return null;
    const requirements = uniqueItems(toStringArray(found.requirements));
    const requirementsTechnical = uniqueItems(toStringArray(found.requirements_technical ?? found.requirementsTechnical));
    const requirementsBehavioral = uniqueItems(toStringArray(found.requirements_behavioral ?? found.requirementsBehavioral));
    const responsibilities = uniqueItems(toStringArray(found.responsibilities));
    const kpis = uniqueItems(toStringArray(found.kpis));
    const competencies = uniqueItems(toStringArray(found.competencies));

    return {
        id: found.id,
        title: found.title,
        area: found.department,
        location: found.location,
        model: found.model,
        contract: found.contract,
        level: found.seniority,
        urgency: found.urgency,
        salary: { min: found.salary_min, max: found.salary_max },
        registrationDeadline: found.registration_deadline,
        experienceMin: found.experience_min,
        reportsTo: found.reports_to,
        workSchedule: found.work_schedule,
        publishedAt: formatDate(found.created_at, undefined, 'Data não informada'),
        mission: found.mission || "",
        context: found.context || "",
        salary_min: found.salary_min,
        salary_max: found.salary_max,
        city: found.city,
        state: found.state,
        companies: found.companies,
        companyName: found.company_name || found.companies?.name,
        roleCode: found.role_code,
        requirements,
        requirements_technical: requirementsTechnical,
        requirementsTechnical,
        requirements_behavioral: requirementsBehavioral,
        requirementsBehavioral,
        responsibilities,
        kpis,
        competencies,
        benefits: Array.isArray(found.benefits) && found.benefits.length > 0
            ? found.benefits.map((b: string) => {
                const parts = b.split('|');
                if (parts.length === 3) {
                    return { title: parts[0], icon: parts[1], colorId: parts[2] };
                }
                return { title: b, icon: getBenefitIcon(b), colorId: 'verde' };
            })
            : [],
    };
};
