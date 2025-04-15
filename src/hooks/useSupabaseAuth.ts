
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseAuth = () => {
  const loginWithSupabase = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const registerWithSupabase = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/todos`
      }
    });
    
    if (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithNaver = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'naver' as any,
      options: {
        redirectTo: `${window.location.origin}/todos`
      }
    });
    
    if (error) {
      console.error("Naver login error:", error);
      throw error;
    }
  };

  return {
    loginWithSupabase,
    registerWithSupabase,
    loginWithGoogle,
    loginWithNaver
  };
};
