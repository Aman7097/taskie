import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import Button from "../components/button";
// import { Task } from "../types/types";

interface TaskProps {
  task: any;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => (
  <Draggable draggableId={task._id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="p-2 mb-2 cursor-move bg-opacity-10 bg-primary"
      >
        <h3 className="mb-1 text-base font-bold text-black">{task.title}</h3>
        <p className="mb-1 text-sm text-gray-500 min-h-20">
          {task.description}
        </p>
        <p className="mb-2 text-sm text-gray-500">
          Created at: {task.createdAt}
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="danger">Delete</Button>
          <Button variant="primary" disabled>
            Edit
          </Button>
          <Button variant="primary">View Details</Button>
        </div>
      </div>
    )}
  </Draggable>
);

export default Task;
