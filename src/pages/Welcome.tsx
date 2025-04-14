
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, LogIn } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="flex items-center mb-6">
          <CheckCircle className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold">할 일 관리</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          효율적으로 작업을 관리하고 완료하세요.
        </p>
        
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">주요 기능</h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>할 일 추가, 수정, 삭제</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>우선순위 설정</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>진행상황 통계</span>
            </li>
          </ul>
        </div>
        
        <Button size="lg" onClick={() => navigate("/login")}>
          <LogIn className="mr-2 h-5 w-5" />
          로그인하고 시작하기
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
