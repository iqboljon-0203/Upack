import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';


export async function GET(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    const getItems = searchParams.get("items");
    const getHistory = searchParams.get("historyUserId");

    // If fetching history for a user
    if (getHistory) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('user_id', getHistory)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // If fetching details for a specific order
    if (orderId && getItems) {
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('*, products(name, image)')
        .eq('order_id', orderId);
      if (itemsError) throw itemsError;

      return NextResponse.json({ success: true, data: { order: orderData, items: itemsData } });
    }

    // Fetch all orders
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Admin orders API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { orderId, status } = await req.json();

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
