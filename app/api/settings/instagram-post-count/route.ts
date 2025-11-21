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
      .eq('key', 'instagram_post_count')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const count = data?.value ? parseInt(data.value) : 5;
    const response = NextResponse.json({ count });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching Instagram post count setting:", error);
    const response = NextResponse.json({ count: 5 }, { status: 200 }); // Default to 5
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }
}
