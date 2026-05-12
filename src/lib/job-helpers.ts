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

export const mapJobToDetail = (found: any) => {
    if (!found) return null;
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
        mission: found.context || found.mission || "",
        requirements: toStringArray(found.requirements),
        requirementsTechnical: toStringArray(found.requirements_technical),
        requirementsBehavioral: toStringArray(found.requirements_behavioral),
        responsibilities: toStringArray(found.responsibilities),
        kpis: toStringArray(found.kpis),
        competencies: toStringArray(found.competencies),
        benefits: Array.isArray(found.benefits) && found.benefits.length > 0
            ? found.benefits.map((b: string) => {
                const parts = b.split('|');
                if (parts.length === 3) {
                    return { title: parts[0], icon: parts[1], colorId: parts[2] };
                }
                return { title: b, icon: getBenefitIcon(b), colorId: 'sky' };
            })
            : [],
    };
};
