
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { Task } from "@/types/task";

const UserTasks = () => {
  const { email } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (email) {
      const userTaskKey = `tasks_${email}`;
      const savedTasks = localStorage.getItem(userTaskKey);
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          })));
        } catch (error) {
          console.error("Error loading tasks:", error);
          setTasks([]);
        }
      }
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Header />
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{email} 님의 할 일 목록</h2>
          <TaskStats tasks={tasks} />
          <TaskList 
            tasks={tasks}
            onToggleComplete={() => {}}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default UserTasks;
