
import { CheckCircle } from "lucide-react";

const Header = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center mb-2">
        <CheckCircle className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-3xl font-bold">할 일 관리</h1>
      </div>
      <p className="text-muted-foreground">효율적으로 작업을 관리하고 완료하세요.</p>
    </div>
  );
};

export default Header;
