import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID!;

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  fullName: string;
  phone: string;
  address: string;
  comment: string;
  paymentMethod: string;
  items: OrderItem[];
  totalPrice: number;
}

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

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "naqd": return "💵 Naqd pul";
    case "click": return "📱 Click";
    case "payme": return "📱 Payme";
    default: return method;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: OrderData = await req.json();

    // Validation
    if (!data.fullName || !data.phone || !data.address || !data.items?.length) {
      return NextResponse.json(
        { success: false, message: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `UPK-${Date.now().toString().slice(-6)}`;
    const date = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format items list
    const itemsList = data.items
      .map(
        (item, i) =>
          `  ${i + 1}. ${item.name}\n     ${item.quantity} x ${item.price.toLocaleString("ru-RU")} = ${(item.quantity * item.price).toLocaleString("ru-RU")} so'm`
      )
      .join("\n");

    // Build Telegram message
    const message =
      `🛒 <b>YANGI BUYURTMA!</b> #${orderNumber}\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 <b>Mijoz:</b> ${data.fullName}\n` +
      `📞 <b>Telefon:</b> ${data.phone}\n` +
      `📍 <b>Manzil:</b> ${data.address}\n` +
      `${data.comment ? `💬 <b>Izoh:</b> ${data.comment}\n` : ""}` +
      `💳 <b>To'lov:</b> ${formatPaymentMethod(data.paymentMethod)}\n\n` +
      `📦 <b>Mahsulotlar:</b>\n${itemsList}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 <b>JAMI: ${data.totalPrice.toLocaleString("ru-RU")} so'm</b>\n` +
      `🕐 ${date}`;

    // Send to Telegram group
    if (GROUP_CHAT_ID) {
      await sendTelegramMessage(GROUP_CHAT_ID, message);
    }

    // Save to Supabase using Admin client
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      // (data as any).userId might be passed from the client
      const userId = (data as any).userId || null;
      
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          customer_name: data.fullName,
          customer_phone: data.phone,
          status: 'pending',
          total_price: data.totalPrice,
          shipping_address: data.address,
          payment_method: data.paymentMethod,
          comment: data.comment
        })
        .select('id')
        .single();

      if (orderData && !orderError) {
        const orderItems = data.items.map(item => ({
          order_id: orderData.id,
          product_id: (item as any).id, // need to ensure we pass id
          quantity: item.quantity,
          price: item.price
        }));
        
        await supabaseAdmin.from('order_items').insert(orderItems);
      } else {
        console.error("Order Insert Error:", orderError);
      }
    } catch (dbError) {
      console.error("Error saving order to DB:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Buyurtmangiz qabul qilindi!",
      orderNumber,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Server xatosi yuz berdi" },
      { status: 500 }
    );
  }
}
