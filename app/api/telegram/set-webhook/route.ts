import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "url query parameter required. Example: /api/telegram/set-webhook?url=https://yourdomain.com" },
      { status: 400 }
    );
  }

  const webhookUrl = `${url}/api/telegram/webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    }
  );

  const data = await res.json();

  return NextResponse.json({
    message: "Webhook set",
    webhookUrl,
    telegram_response: data,
  });
}
