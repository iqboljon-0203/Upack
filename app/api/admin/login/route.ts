import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email va parolni kiriting" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Create standard client to sign in
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, message: "Noto'g'ri email yoki parol" },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json({ success: true });
    
    // Set cookie option details
    const cookieOptions: any = {
      name: 'admin_token',
      value: data.session.access_token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };

    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
      cookieOptions.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    }
    
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Server xatosi" },
      { status: 500 }
    );
  }
}
