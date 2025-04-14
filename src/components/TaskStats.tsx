
import { Task } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(task => task.priority === "high" && !task.completed).length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === "medium" && !task.completed).length;
  const lowPriorityTasks = tasks.filter(task => task.priority === "low" && !task.completed).length;

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-3">진행 상황</h2>
      <Progress value={completionRate} className="h-2 mb-2" />
      <p className="text-sm text-gray-600 mb-4">
        {totalTasks > 0 
          ? `${completedTasks}개 완료 / 총 ${totalTasks}개 (${completionRate}%)`
          : "작업이 없습니다. 위에서 작업을 추가해보세요!"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center">
            <div className="mr-4 bg-todo-high/20 p-2 rounded-full">
              <Clock className="h-5 w-5 text-todo-high" />
            </div>
            <div>
              <p className="text-sm text-gray-500">중요 작업</p>
              <p className="text-2xl font-semibold">{highPriorityTasks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center">
            <div className="mr-4 bg-todo-medium/20 p-2 rounded-full">
              <Circle className="h-5 w-5 text-todo-medium" />
            </div>
            <div>
              <p className="text-sm text-gray-500">일반 작업</p>
              <p className="text-2xl font-semibold">{mediumPriorityTasks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center">
            <div className="mr-4 bg-todo-low/20 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-todo-low" />
            </div>
            <div>
              <p className="text-sm text-gray-500">낮은 우선순위</p>
              <p className="text-2xl font-semibold">{lowPriorityTasks}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskStats;
