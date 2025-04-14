
import { CheckCircle, LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">할 일 관리</h1>
        </div>
        <div className="flex gap-2">
          {user ? (
            <>
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                {user.email}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              로그인
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-center">효율적으로 작업을 관리하고 완료하세요.</p>
    </div>
  );
};

export default Header;
