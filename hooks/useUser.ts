"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCurrentUser() {
      try {
        const { data } = await supabase.auth.getUser();
        const current = data?.user ?? null;
        if (mounted) setUser(current);
      } catch (err) {
        // ignore - keep user null
        if (mounted) setUser(null);
      }
    }

    fetchCurrentUser();

    const { data: subscriptionData } = supabase.auth.onAuthStateChange((_: any, session: any) => {
      setUser(session?.user ?? null);
    });

    const subscription = subscriptionData?.subscription;

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return user;
}
