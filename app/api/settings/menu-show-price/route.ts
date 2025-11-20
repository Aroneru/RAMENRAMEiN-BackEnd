import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'menu_show_price')
      .single();

    if (error) {
      console.error('Error fetching setting:', error);
      return NextResponse.json({ showPrice: true }); // Default to showing prices
    }

    return NextResponse.json({ showPrice: data?.value === 'true' });
  } catch (err) {
    console.error('Error in settings API:', err);
    return NextResponse.json({ showPrice: true }); // Default to showing prices
  }
}
