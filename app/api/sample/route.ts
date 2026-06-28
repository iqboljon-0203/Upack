import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID!;

async function sendTelegramMessage(chatId: string, text: string) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || !data.phone) {
      return NextResponse.json(
        { success: false, message: "Ism va telefon raqam kiritilishi shart" },
        { status: 400 }
      );
    }

    const date = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build Telegram message
    const message =
      `🎁 <b>YANGI NAMUNA SO'ROVI!</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 <b>Mijoz:</b> ${data.name}\n` +
      `📞 <b>Telefon:</b> ${data.phone}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🕐 ${date}`;

    // Send to Telegram group
    if (GROUP_CHAT_ID) {
      await sendTelegramMessage(GROUP_CHAT_ID, message);
    }

    // Save to Supabase orders table so it shows up in Admin panel
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: null,
          customer_name: data.name,
          customer_phone: data.phone,
          status: 'pending',
          total_price: 0,
          shipping_address: "Namuna yetkazib berish (aniqlashtiriladi)",
          payment_method: "Namuna",
          comment: "🎁 Bepul namuna so'rovi (Sample Kit)"
        })
        .select('id')
        .single();

      if (orderError) {
        console.error("Sample Insert Error:", orderError);
      }
    } catch (dbError) {
      console.error("Error saving sample to DB:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Arizangiz qabul qilindi!",
    });
  } catch (error) {
    console.error("Sample error:", error);
    return NextResponse.json(
      { success: false, message: "Server xatosi yuz berdi" },
      { status: 500 }
    );
  }
}
