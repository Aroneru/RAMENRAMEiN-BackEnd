export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function DebugSession() {
  const cookieStore = await cookies();
  const cookieSnapshot = cookieStore.getAll().map(c => ({ name: c.name, value: c.value?.slice(0, 12) + '...' }));
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      
      <div className="bg-white p-4 rounded-lg mb-4">
        <h2 className="font-bold mb-2">Now:</h2>
        <pre className="text-xs">{new Date().toISOString()}</pre>
      </div>

      <div className="bg-white p-4 rounded-lg mb-4">
        <h2 className="font-bold mb-2">Request Cookies:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(cookieSnapshot, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-4 rounded-lg mb-4">
        <h2 className="font-bold mb-2">getUser():</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({ user, userError }, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-4 rounded-lg mb-4">
        <h2 className="font-bold mb-2">Session:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h2 className="font-bold mb-2">Profile:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </div>
  );
}
