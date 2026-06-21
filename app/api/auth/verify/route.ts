import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp-store";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: "Iltimos, 6 xonali kodni kiriting" },
        { status: 400 }
      );
    }

    const result = await verifyOTP(code);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: "Kod noto'g'ri yoki muddati o'tgan. Qaytadan urinib ko'ring." },
        { status: 401 }
      );
    }

    // Connect to Supabase with Service Role to create/login users
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const email = `tg_${result.chatId}@upackb2b.uz`;
    const password = `upack_${result.chatId}_secure_pass_2026`; // deterministik parol

    let { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError && authError.message.includes('Invalid login credentials')) {
      // User doesn't exist, create it
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username: result.username,
          first_name: result.firstName,
          chat_id: result.chatId,
        },
      });

      // Try sign in again
      const res = await supabaseAdmin.auth.signInWithPassword({ email, password });
      authData = res.data;
    }

    if (!authData?.session) {
      throw new Error("Failed to create Supabase session");
    }

    // Session yaratamiz, lekin Supabase sessiyasini ham clientga qaytaramiz
    const sessionToken = Buffer.from(
      JSON.stringify({
        chatId: result.chatId,
        username: result.username,
        firstName: result.firstName,
        loginAt: Date.now(),
      })
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      message: "Muvaffaqiyatli kirdingiz!",
      user: {
        username: result.username,
        firstName: result.firstName,
      },
      supabaseSession: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      }
    });

    // Eski custom cookieni ham saqlab qo'yamiz (compatibility)
    response.cookies.set("upack_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, message: "Server xatosi yuz berdi" },
      { status: 500 }
    );
  }
}
