
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSupabaseAuth = () => {
  const { toast } = useToast();

  const loginWithSupabase = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const registerWithSupabase = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/todos`
        }
      });
      
      if (error) {
        console.error("Google login error:", error);
        toast({
          title: "구글 로그인 오류",
          description: "Supabase에서 구글 로그인이 활성화되지 않았습니다. Supabase 대시보드에서 설정해주세요.",
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      toast({
        title: "구글 로그인 실패",
        description: "구글 로그인 중 문제가 발생했습니다. Supabase 설정을 확인해주세요.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithNaver = async () => {
    try {
      toast({
        title: "네이버 로그인 정보",
        description: "Supabase에서 네이버 로그인 제공자가 지원되지 않거나 활성화되지 않았습니다. Supabase 대시보드에서 OAuth 설정을 확인해주세요.",
        variant: "default",
      });
      
      // 네이버 로그인 처리를 시도합니다만, 현재 Supabase에서 지원하지 않는 것으로 보입니다.
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
    } catch (error) {
      console.error("Naver login catch error:", error);
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
