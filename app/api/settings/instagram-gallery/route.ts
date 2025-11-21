import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'instagram_gallery_enabled')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    console.log('Instagram gallery DB value:', data?.value, 'Type:', typeof data?.value);
    // Default to true if not set, or check if it's explicitly set to 'true'
    const enabled = data?.value === undefined ? true : (data?.value === 'true' || data?.value === true);
    console.log('Instagram gallery enabled result:', enabled);

    const response = NextResponse.json({ 
      enabled 
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching Instagram gallery setting:", error);
    const response = NextResponse.json({ enabled: true }, { status: 200 }); // Default to true
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }
}
