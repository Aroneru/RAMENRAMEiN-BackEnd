'use server';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function getSettingAction(key: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw new Error(error.message);

    return { data };
  } catch (err: unknown) {
    return { error: (err as Error).message || 'Failed to load setting' };
  }
}

export async function updateSettingAction(key: string, value: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update settings' };
  }

  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: key,
        value: value,
        updated_by: user.id
      }, {
        onConflict: 'key'
      });

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (err: unknown) {
    console.error('Error updating setting:', err);
    return { error: (err as Error).message || 'Failed to update setting' };
  }
}
