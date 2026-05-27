import { supabase } from '../src/lib/supabase';

async function test() {
    const fullSelect = 'id, title, department, location, model, contract, seniority, urgency, created_at, registration_deadline, status, salary_min, salary_max, positions_count, requirements, experience_min, reports_to, context, mission, requirements_technical, requirements_behavioral, kpis, competencies, role_code, company_id, company:companies!inner(name, slug, status)';
    
    const { data, error } = await supabase
        .from('jobs')
        .select(fullSelect)
        .eq('status', 'Ativa')
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('ERROR:', error);
        return;
    }
    
    console.log('DATA:', JSON.stringify(data, null, 2));
}

test();
