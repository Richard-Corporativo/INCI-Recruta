const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const fullSelect = 'id, title, department, location, model, contract, seniority, urgency, is_pcd, pcd, pcd_only, exclusive_pcd, created_at, registration_deadline, status, salary_min, salary_max, positions_count, requirements, experience_min, reports_to, context, mission, requirements_technical, requirements_behavioral, kpis, competencies, role_code, company_id, company:companies(name, slug, status)';
    
    const { data, error } = await supabase
        .from('jobs')
        .select(fullSelect)
        .eq('status', 'Ativa')
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('ERROR:', error);
        return;
    }
    
    console.log('DATA COUNT:', data.length);
    console.log('SAMPLE:', JSON.stringify(data[0], null, 2));
}

test();
