const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://psxmtxvrxkdgzrgwssse.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeG10eHZyeGtkZ3pyZ3dzc3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQwMDQ3MiwiZXhwIjoyMDUzOTc2NDcyfQ.5Z9hQ8oJ2K-P9w9rW-E8E9V7v5j1z3Q2r9R8t6y5w4U"
);

async function checkOrders() {
  const { data, error } = await supabase.from('orders').select('id, user_id, customer_name, created_at').order('created_at', { ascending: false }).limit(5);
  console.log("Error:", error);
  console.log("Recent Orders:");
  console.table(data);
}
checkOrders();
