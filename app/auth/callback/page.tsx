'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        sessionStorage.setItem('signed_in', 'true');
      }
      router.replace('/');
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-slate-200">
      <p>Signing you in...</p>
    </div>
  );
}