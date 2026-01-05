import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'thiago.nascimento@incibrasil.com.br';
    const password = 'b123jk123';

    console.log(`Attempting to sign up user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: 'Thiago Nascimento'
            }
        }
    });

    if (error) {
        console.error('Error signing up:', error.message);
        return;
    }

    console.log('User created successfully:', data.user?.id);
    console.log('Please run the SQL script to approve/confirm this user if email confirmation is enabled.');
}

createAdmin();
