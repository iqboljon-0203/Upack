import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 0; // Dynamic fetch

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*');

    if (error) {
      console.error("Error fetching site content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const contentMap: Record<string, any> = {};
    if (data) {
      data.forEach((item) => {
        contentMap[item.id] = item.data;
      });
    }

    return NextResponse.json(contentMap);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
