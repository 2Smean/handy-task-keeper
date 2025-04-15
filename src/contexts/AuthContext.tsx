
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  loginWithNaver: async () => {},
  supabaseInitialized: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const supabaseInitialized = supabase !== null;
  
  const { localLogin, localRegister } = useLocalAuth();
  const { loginWithSupabase, registerWithSupabase, loginWithGoogle, loginWithNaver } = useSupabaseAuth();
  
  useEffect(() => {
    console.log("Supabase 초기화 상태:", supabaseInitialized);
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        if (session) {
          setUser({
            email: session.user.email || '',
            id: session.user.id
          });
        } else {
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('currentUser');
            }
          } else {
            setUser(null);
          }
        }
      }
    );

    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Initial session found:", data.session.user.email);
        setUser({
          email: data.session.user.email || '',
          id: data.session.user.id
        });
      }
    };
    
    checkUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabaseInitialized]);

  const login = async (email: string, password: string) => {
    try {
      if (!supabaseInitialized) {
        const userObj = await localLogin(email, password);
        setUser(userObj);
        return;
      }
      
      await loginWithSupabase(email, password);
    } catch (error) {
      if (supabaseInitialized) {
        try {
          const userObj = await localLogin(email, password);
          setUser(userObj);
        } catch (localError) {
          throw error;
        }
      } else {
        throw error;
      }
    }
  };

  const register = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      await localRegister(email, password);
      return;
    }
    
    await registerWithSupabase(email, password);
    await localRegister(email, password);
  };

  const logout = async () => {
    if (supabaseInitialized) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loginWithGoogle, 
      loginWithNaver,
      supabaseInitialized 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다');
  }
  return context;
};
