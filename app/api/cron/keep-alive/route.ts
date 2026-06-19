import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Simple quick query to keep the database active
    const { data, error } = await supabase.from("categories").select("id").limit(1);

    if (error) {
      console.error("Keep alive cron error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Supabase database pinged successfully to prevent pausing.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Keep alive crash error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
