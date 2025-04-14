
import { useState } from "react";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (editValue.trim() !== "") {
      onEdit(task.id, editValue);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditValue(task.title);
    setIsEditing(false);
  };

  const priorityColors = {
    low: "bg-todo-low",
    medium: "bg-todo-medium",
    high: "bg-todo-high",
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border mb-2 bg-white shadow-sm transition-all",
      task.completed ? "opacity-60" : "opacity-100"
    )}>
      <div className="flex items-center flex-1 mr-4">
        <div className="flex items-center space-x-3">
          <Checkbox 
            id={`task-${task.id}`} 
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
          />
          <div 
            className={cn(
              "w-2 h-6 rounded mr-2",
              priorityColors[task.priority]
            )} 
          />
        </div>
        
        {isEditing ? (
          <Input
            className="ml-3 flex-1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
        ) : (
          <label 
            htmlFor={`task-${task.id}`}
            className={cn(
              "ml-3 text-base select-none cursor-pointer flex-1",
              task.completed ? "line-through text-gray-500" : ""
            )}
          >
            {task.title}
          </label>
        )}
      </div>
      
      <div className="flex space-x-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEdit}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
