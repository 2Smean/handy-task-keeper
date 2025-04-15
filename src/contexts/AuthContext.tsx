
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// User 타입 정의
interface User {
  email: string;
  id?: string;
  // 필요에 따라 다른 사용자 속성 추가
}

// 사용자 자격 증명 타입
interface UserCredential {
  email: string;
  password: string;
}

// AuthContext 타입 정의
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithNaver: () => Promise<void>;
  supabaseInitialized: boolean;
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  loginWithNaver: async () => {},
  supabaseInitialized: false,
});

// 제공자 컴포넌트 생성
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const supabaseInitialized = supabase !== null;
  
  useEffect(() => {
    console.log("Supabase 초기화 상태:", supabaseInitialized);
    
    // Supabase 세션 확인
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        if (session) {
          // 세션이 있으면 사용자 설정
          setUser({
            email: session.user.email || '',
            id: session.user.id
          });
        } else {
          // 세션이 없으면 로컬 스토리지 확인
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
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

    // 초기 세션 확인
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
  }, [supabaseInitialized, toast]);

  // 구글 로그인
  const loginWithGoogle = async () => {
    if (!supabaseInitialized) {
      toast({
        title: "Supabase 설정 오류",
        description: "Supabase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/todos`
      }
    });
    
    if (error) {
      console.error("Google login error:", error);
      throw new Error(error.message);
    }
  };

  // 네이버 로그인
  const loginWithNaver = async () => {
    if (!supabaseInitialized) {
      toast({
        title: "Supabase 설정 오류",
        description: "Supabase가 초기화되지 않았습니다. 환경 변수를 확인해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      // 네이버는 기본 Provider 타입에 없으므로 'any' 타입으로 변환
      provider: 'naver' as any,
      options: {
        redirectTo: `${window.location.origin}/todos`
      }
    });
    
    if (error) {
      console.error("Naver login error:", error);
      throw new Error(error.message);
    }
  };

  // 회원가입 함수
  const register = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      // 로컬 스토리지 방식으로 대체
      const usersJson = localStorage.getItem('users') || '[]';
      const users: UserCredential[] = JSON.parse(usersJson);
      
      // 이메일이 이미 존재하는지 확인
      if (users.some(user => user.email === email)) {
        throw new Error('이미 등록된 이메일입니다.');
      }
      
      // 새 사용자 추가
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: "로컬 회원가입",
        description: "Supabase가 설정되지 않아 로컬 스토리지에 사용자 정보가 저장되었습니다.",
      });
      return;
    }
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // 레거시 코드 지원 (로컬 스토리지)
    const usersJson = localStorage.getItem('users') || '[]';
    const users: UserCredential[] = JSON.parse(usersJson);
    
    // 이메일이 이미 존재하는지 확인
    if (users.some(user => user.email === email)) {
      throw new Error('이미 등록된 이메일입니다.');
    }
    
    // 새 사용자 추가
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
  };

  // 로그인 함수
  const login = async (email: string, password: string) => {
    if (!supabaseInitialized) {
      // Supabase가 초기화되지 않은 경우 로컬 스토리지만 사용
      const usersJson = localStorage.getItem('users') || '[]';
      const users: UserCredential[] = JSON.parse(usersJson);
      
      // 사용자 찾기
      const foundUser = users.find(user => user.email === email && user.password === password);
      
      if (!foundUser) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      
      // 사용자를 상태 및 로컬 스토리지에 저장
      const userObj: User = { email: foundUser.email };
      setUser(userObj);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      
      toast({
        title: "로컬 로그인",
        description: "Supabase가 설정되지 않아 로컬 스토리지의 사용자 정보로 로그인했습니다.",
      });
      return;
    }
    
    // Supabase 로그인 시도
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      // Supabase 로그인 실패 시 로컬 스토리지 시도
      const usersJson = localStorage.getItem('users') || '[]';
      const users: UserCredential[] = JSON.parse(usersJson);
      
      // 사용자 찾기
      const foundUser = users.find(user => user.email === email && user.password === password);
      
      if (!foundUser) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      
      // 사용자를 상태 및 로컬 스토리지에 저장
      const userObj: User = { email: foundUser.email };
      setUser(userObj);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    if (supabaseInitialized) {
      // Supabase 로그아웃
      await supabase.auth.signOut();
    }
    
    // 사용자 상태 및 로컬 스토리지에서 제거
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

// AuthContext를 사용하기 위한 사용자 정의 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다');
  }
  return context;
};
