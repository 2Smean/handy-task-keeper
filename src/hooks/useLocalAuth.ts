
import { User, UserCredential } from '@/types/auth';
import { useToast } from "@/components/ui/use-toast";

export const useLocalAuth = () => {
  const { toast } = useToast();

  const localLogin = async (email: string, password: string) => {
    const usersJson = localStorage.getItem('users') || '[]';
    const users: UserCredential[] = JSON.parse(usersJson);
    
    const foundUser = users.find(user => user.email === email && user.password === password);
    
    if (!foundUser) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    
    const userObj: User = { email: foundUser.email };
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    
    return userObj;
  };

  const localRegister = async (email: string, password: string) => {
    const usersJson = localStorage.getItem('users') || '[]';
    const users: UserCredential[] = JSON.parse(usersJson);
    
    if (users.some(user => user.email === email)) {
      throw new Error('이미 등록된 이메일입니다.');
    }
    
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    toast({
      title: "로컬 회원가입",
      description: "Supabase가 설정되지 않아 로컬 스토리지에 사용자 정보가 저장되었습니다.",
    });
  };

  return { localLogin, localRegister };
};
