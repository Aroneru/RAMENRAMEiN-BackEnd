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
      .eq('key', 'menu_popup_enabled')
      .single();

    if (error) {
      console.error('Error fetching setting:', error);
      return NextResponse.json({ enabled: true }); // Default to enabled
    }

    return NextResponse.json({ enabled: data?.value === 'true' });
  } catch (err) {
    console.error('Error in settings API:', err);
    return NextResponse.json({ enabled: true }); // Default to enabled
  }
}
