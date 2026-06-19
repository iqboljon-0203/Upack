import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface OTPEntry {
  code: string;
  chatId: number;
  username?: string;
  firstName?: string;
  expiresAt: number;
  used: boolean;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function getOTPStore(): Promise<Record<string, OTPEntry>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "otp_store")
      .single();

    if (error) {
      if (error.code === "PGRST116") { // Not found
        // Create the record
        await supabaseAdmin
          .from("site_content")
          .insert({ id: "otp_store", data: {} });
        return {};
      }
      console.error("Error fetching OTP store from database:", error);
      return {};
    }

    return (data?.data as Record<string, OTPEntry>) || {};
  } catch (err) {
    console.error("Failed to get OTP store:", err);
    return {};
  }
}

async function saveOTPStore(store: Record<string, OTPEntry>): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: "otp_store", data: store });

    if (error) {
      console.error("Error saving OTP store to database:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to save OTP store:", err);
    return false;
  }
}

export async function storeOTP(code: string, chatId: number, username?: string, firstName?: string) {
  const store = await getOTPStore();
  const now = Date.now();

  // Clean expired codes
  for (const key in store) {
    if (store[key].expiresAt < now) {
      delete store[key];
    }
  }

  // Store new code (expires in 2 minutes)
  store[code] = {
    code,
    chatId,
    username,
    firstName,
    expiresAt: now + 2 * 60 * 1000,
    used: false,
  };

  await saveOTPStore(store);
}

export async function verifyOTP(code: string): Promise<{ valid: boolean; chatId?: number; username?: string; firstName?: string }> {
  const store = await getOTPStore();
  const entry = store[code];

  if (!entry) {
    return { valid: false };
  }

  if (entry.used) {
    return { valid: false };
  }

  if (entry.expiresAt < Date.now()) {
    delete store[code];
    await saveOTPStore(store);
    return { valid: false };
  }

  // Mark as used by deleting
  delete store[code];
  await saveOTPStore(store);

  return {
    valid: true,
    chatId: entry.chatId,
    username: entry.username,
    firstName: entry.firstName,
  };
}
