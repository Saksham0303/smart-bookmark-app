"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({ title: 'Error', description: 'Could not sign out.' });
        return;
      }
      router.push('/');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Sign out failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="text-slate-200"
      onClick={handleLogout}
      disabled={loading}
    >
      Logout
    </Button>
  );
}
