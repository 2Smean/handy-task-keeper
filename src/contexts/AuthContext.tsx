
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

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
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  loginWithNaver: async () => {},
});

// 제공자 컴포넌트 생성
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // 컴포넌트 마운트 시 사용자 세션 확인
  useEffect(() => {
    // Supabase 세션 확인
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
  }, []);

  // 구글 로그인
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/todos`
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  // 네이버 로그인
  const loginWithNaver = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'naver',
      options: {
        redirectTo: `${window.location.origin}/todos`
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  // 회원가입 함수
  const register = async (email: string, password: string) => {
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
    // Supabase 로그아웃
    await supabase.auth.signOut();
    
    // 사용자 상태 및 로컬 스토리지에서 제거
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loginWithGoogle, loginWithNaver }}>
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
