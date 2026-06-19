import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables. Please check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  const email = 'admin@upack.uz';
  const password = 'upack_admin_2026';

  console.log(`Creating admin user: ${email}`);

  // 1. Check if user already exists
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  const existingAdmin = users.users.find(u => u.email === email);

  if (existingAdmin) {
    console.log("Admin user already exists. Updating password just in case...");
    const { error: updateError } = await supabase.auth.admin.updateUserById(existingAdmin.id, {
      password: password,
      user_metadata: { role: 'admin' }
    });
    
    if (updateError) {
      console.error("Error updating admin password:", updateError);
    } else {
      console.log("Admin password updated successfully!");
    }
  } else {
    // 2. Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (error) {
      console.error("Error creating admin user:", error);
    } else {
      console.log("Admin user created successfully!", data.user.id);
    }
  }
}

createAdmin();
