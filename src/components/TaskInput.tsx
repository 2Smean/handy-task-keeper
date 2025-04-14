
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Priority } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

interface TaskInputProps {
  onAddTask: (title: string, priority: Priority) => void;
}

const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "작업을 입력해주세요",
        description: "할 일을 입력해야 합니다.",
        variant: "destructive",
      });
      return;
    }
    
    onAddTask(title, priority);
    setTitle("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <Input
        placeholder="할 일을 입력하세요..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow"
      />
      <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="우선순위" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">낮음</SelectItem>
          <SelectItem value="medium">중간</SelectItem>
          <SelectItem value="high">높음</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="flex-shrink-0">
        <Plus className="h-4 w-4 mr-2" />
        추가
      </Button>
    </form>
  );
};

export default TaskInput;
