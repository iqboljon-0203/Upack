const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://psxmtxvrxkdgzrgwssse.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeG10eHZyeGtkZ3pyZ3dzc3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc3NTU2NCwiZXhwIjoyMDk3MzUxNTY0fQ.aqwiwoFhYGMwVYEYm1HeKSHO65u9f-sqei6r5RLT-Hg"
);

async function check() {
  const { data, error } = await supabase
    .from("products")
    .select("name_ru, full_desc_ru")
    .limit(1);

  if (error) {
    console.error("Columns might not exist. Error:", error.message);
  } else {
    console.log("Columns exist! Data:", data);
  }
}

check();
