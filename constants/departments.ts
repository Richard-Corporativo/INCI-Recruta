// Predefined department areas for roles
export const DEPARTMENT_AREAS = [
    'Tecnologia',
    'Marketing',
    'Design',
    'Recursos Humanos',
    'Financeiro'
] as const;

export type DepartmentArea = typeof DEPARTMENT_AREAS[number];
