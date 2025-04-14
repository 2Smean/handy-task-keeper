
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { Task, Priority } from "@/types/task";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    // 사용자별 localStorage 키 생성
    const userTaskKey = `tasks_${user?.email}`;
    
    // 해당 사용자의 tasks 데이터 로드
    const savedTasks = localStorage.getItem(userTaskKey);
    if (savedTasks) {
      try {
        // Parse the saved tasks and convert createdAt strings back to Date objects
        return JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
      } catch (error) {
        console.error("Error parsing saved tasks:", error);
        return [];
      }
    }
    return [];
  });

  const { toast } = useToast();

  // 사용자별 localStorage에 tasks 저장
  useEffect(() => {
    if (user) {
      const userTaskKey = `tasks_${user.email}`;
      localStorage.setItem(userTaskKey, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "작업 추가됨",
      description: "새 할 일이 추가되었습니다.",
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "작업 삭제됨",
      description: "할 일이 삭제되었습니다.",
    });
  };

  const editTask = (id: string, newTitle: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    toast({
      title: "작업 수정됨",
      description: "할 일이 수정되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Header />
        
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <TaskInput onAddTask={addTask} />
          <TaskStats tasks={tasks} />
          <TaskList 
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
