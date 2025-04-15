import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, loginWithNaver, supabaseInitialized } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
      navigate("/todos");
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "이메일 또는 비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      // 리디렉션되므로 여기에 성공 토스트가 필요하지 않습니다.
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "구글 로그인 실패",
        description: "구글 로그인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleNaverLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithNaver();
      // 리디렉션되므로 여기에 성공 토스트가 필요하지 않습니다.
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "네이버 로그인 실패",
        description: "네이버 로그인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>할 일 관리 서비스를 이용하려면 로그인하세요.</CardDescription>
        </CardHeader>
        
        {!supabaseInitialized && (
          <div className="px-6 mb-4">
            <Alert variant="default" className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Supabase 연결이 설정되지 않았습니다. 소셜 로그인은 사용할 수 없으며, 로컬 스토리지를 통한 로그인만 가능합니다.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">이메일</label>
              <Input
                id="email"
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "로그인 중..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  이메일 로그인
                </>
              )}
            </Button>

            <div className="relative my-4">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">또는</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-white text-black hover:bg-gray-100 border-gray-300 mb-2" 
              onClick={handleGoogleLogin}
              disabled={isLoading || !supabaseInitialized}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              구글로 로그인
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-[#03C75A] text-white hover:bg-[#03C75A]/90" 
              onClick={handleNaverLogin}
              disabled={isLoading || !supabaseInitialized}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.84 0H6.16C2.76 0 0 2.76 0 6.16v7.68C0 17.24 2.76 20 6.16 20h7.68c3.4 0 6.16-2.76 6.16-6.16V6.16C20 2.76 17.24 0 13.84 0zM14 12.39l-4-5.88V17h-4V3h4l4 5.88V3h4v14h-4v-4.61z"/>
              </svg>
              네이버로 로그인
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/register")}>
              계정이 없으신가요? 회원가입
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
