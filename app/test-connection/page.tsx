'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check Supabase connection
        const { data: health, error: healthError } = await supabase
          .from('user_profiles')
          .select('count', { count: 'exact', head: true });
        
        setStatus((prev: any) => ({
          ...prev,
          tableExists: !healthError,
          tableError: healthError?.message,
          tableErrorCode: healthError?.code
        }));

        // Test 2: Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        setStatus((prev: any) => ({
          ...prev,
          hasSession: !!session,
          sessionError: sessionError?.message,
          userEmail: session?.user?.email
        }));

        // Test 3: Try to fetch user profile
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setStatus((prev: any) => ({
            ...prev,
            profileExists: !!profile,
            profileError: profileError?.message,
            profileErrorCode: profileError?.code,
            profile: profile
          }));
        }

        // Test 4: Check RLS policies
        const { data: testQuery, error: rlsError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);

        setStatus((prev: any) => ({
          ...prev,
          canQuery: !rlsError,
          rlsError: rlsError?.message,
          rlsErrorCode: rlsError?.code
        }));

      } catch (err: any) {
        setStatus((prev: any) => ({
          ...prev,
          generalError: err.message
        }));
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <ul className="space-y-2 text-sm">
            <li>✓ Table exists: {status.tableExists ? '✅ Yes' : '❌ No'}</li>
            <li>✓ Has session: {status.hasSession ? '✅ Yes' : '❌ No (not logged in)'}</li>
            <li>✓ Can query table: {status.canQuery ? '✅ Yes' : '❌ No (RLS issue?)'}</li>
            <li>✓ Profile exists: {status.profileExists ? '✅ Yes' : '❌ No'}</li>
          </ul>

          {status.rlsError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-red-800">RLS Policy Issue:</p>
              <p className="text-red-700 text-sm">{status.rlsError}</p>
              <p className="text-xs text-gray-600 mt-2">
                This usually means Row Level Security is blocking access. 
                Make sure RLS policies are set up correctly.
              </p>
            </div>
          )}

          {status.profileError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-semibold text-yellow-800">Profile Error:</p>
              <p className="text-yellow-700 text-sm">{status.profileError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
