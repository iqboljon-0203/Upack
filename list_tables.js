import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Query supabase schema details or check known tables
  const tables = ['products', 'categories', 'orders', 'content', 'settings', 'site_content'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: NOT FOUND or error (${error.message})`);
    } else {
      console.log(`Table ${table}: EXISTS`);
    }
  }
}
run();
