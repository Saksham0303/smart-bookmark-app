import { supabase } from '@/lib/supabaseClient';

export async function signInWithGoogle() {
  try {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('Supabase Google sign-in error:', error);
    }

    return { data, error };
  } catch (err) {
    console.error('Unexpected signInWithGoogle error:', err);
    return { data: null, error: err as unknown };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Supabase signOut error:', error);
    return { error };
  } catch (err) {
    console.error('Unexpected signOut error:', err);
    return { error: err as unknown };
  }
}
