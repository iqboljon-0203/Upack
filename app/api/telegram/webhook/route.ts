import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp-store";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

async function sendTelegramMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text || "";
    const username = message.from?.username || "";
    const firstName = message.from?.first_name || "Foydalanuvchi";

    console.log("Telegram webhook received message:", { chatId, text, username, firstName });

    if (text.trim().startsWith("/start")) {
      const otp = generateOTP();
      await storeOTP(otp, chatId, username, firstName);

      console.log(`Generated OTP ${otp} for chat ${chatId}`);

      await sendTelegramMessage(
        chatId,
        `🔐 <b>UPack - Tizimga kirish kodi</b>\n\n` +
        `Sizning kodingiz:\n\n` +
        `<code>${otp}</code>\n\n` +
        `⏱ Kod <b>2 daqiqa</b> ichida amal qiladi.\n` +
        `⚠️ Kodni hech kimga bermang!`
      );
    } else {
      await sendTelegramMessage(
        chatId,
        `👋 Salom, ${firstName}!\n\n` +
        `🔑 Tizimga kirish kodi olish uchun /start tugmasini bosing.`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}

