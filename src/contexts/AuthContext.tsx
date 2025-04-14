
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// User 타입 정의
interface User {
  email: string;
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
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// 제공자 컴포넌트 생성
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // 로컬 스토리지에서 사용자 자격 증명 로드
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // 회원가입 함수
  const register = async (email: string, password: string) => {
    // 로컬 스토리지에서 사용자 가져오기
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
    // 로컬 스토리지에서 사용자 가져오기
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
  };

  // 로그아웃 함수
  const logout = () => {
    // 사용자 상태 및 로컬 스토리지에서 제거
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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
