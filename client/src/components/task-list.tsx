import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import Button from "./button";
import { Task } from "../types/types";

interface TaskListProps {
  status: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTaskDetails: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onViewTaskDetails,
}) => (
  <div className="col-span-12 p-2 shadow-md md:col-span-4">
    <div className="px-2 py-2 mb-4 font-medium uppercase bg-primary bg-opacity-80 text-secondary">
      {status}
    </div>
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[200px]"
        >
          {tasks.map((task, index) => (
            // <Task key={task.id} task={task} index={index} />
            <Draggable draggableId={task._id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="p-2 mb-2 cursor-move bg-opacity-10 bg-primary"
                >
                  <h3 className="mb-1 text-base font-bold text-black">
                    {task.title}
                  </h3>
                  <p className="mb-1 text-sm text-gray-500 min-h-20">
                    {task.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due By: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="mb-2 text-sm text-gray-500">
                    Created at: {task.createdAt}
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="danger"
                      onClick={() => onDeleteTask(task._id)}
                    >
                      Delete
                    </Button>
                    <Button variant="primary" onClick={() => onEditTask(task)}>
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => onViewTaskDetails(task)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default TaskList;
