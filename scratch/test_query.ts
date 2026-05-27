
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQuery() {
  const PUBLIC_JOB_COLUMNS = 'id, title, department, location, model, contract, seniority, urgency, created_at, registration_deadline, status, salary_min, salary_max, positions_count, requirements, experience_min, reports_to, context, mission, requirements_technical, requirements_behavioral, kpis, competencies, role_code';
  const fullSelect = `${PUBLIC_JOB_COLUMNS}, company_id, company:companies(name, slug, status)`;
  
  const { data, error } = await supabase
    .from('jobs')
    .select(fullSelect)
    .eq('status', 'Ativa');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data count:', data?.length);
    console.log('First job company:', data?.[0]?.company);
  }
}

testQuery();
