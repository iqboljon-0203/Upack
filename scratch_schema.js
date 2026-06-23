const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSchema() {
  const { data, error } = await supabase.rpc('get_schema');
  if (error) {
    console.error("RPC failed, trying query...", error.message);
    // fallback, just select 1 row from each to see fields
    const tables = ['products', 'orders', 'categories', 'order_items'];
    for (const t of tables) {
      const { data: rows, error: err } = await supabase.from(t).select('*').limit(1);
      console.log(`\nTable ${t}:`);
      if (err) console.error(err);
      else console.log(rows.length > 0 ? Object.keys(rows[0]) : "No data to infer schema");
    }
  } else {
    console.log(data);
  }
}

getSchema();
