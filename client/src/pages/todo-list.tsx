import React, { useState } from "react";
import Button from "../components/button";
import Input from "../components/input";
import CustomSelect from "../components/select";
import { DragDropContext } from "@hello-pangea/dnd";
import Modal from "../components/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, taskSchema } from "../utils/schemas";
import useTodoList from "../hooks/useTodoList";
import { createTask, deleteTask, updateTask } from "../api/axios";
import TaskList from "../components/task-list";

const TodoList: React.FC = () => {
  const {
    tasks,
    searchTerm,
    sortBy,
    handleSearch,
    handleSort,
    onDragEnd,
    refetchTasks,
  } = useTodoList();

  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [showEditTask, setShowEditTask] = useState<boolean>(false);
  const [showTaskDetails, setShowTaskDetails] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onAddTask = async (data: TaskFormData) => {
    try {
      await createTask(data);
      setShowAddTask(false);
      reset();
      refetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // const onEditTask = async (data: TaskFormData) => {
  //   try {
  //     console.log(data);
  //     setShowEditTask(false);
  //     refetchTasks();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onEditTask = (task: Task) => {
    setSelectedTask(task);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("status", task.status);
    setValue("dueDate", task.dueDate);
    setShowEditTask(true);
  };

  const onSubmitEditTask = async (data: TaskFormData) => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask._id, data);
      setShowEditTask(false);
      reset();
      refetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteTask = async (taskId: string) => {
    // if (window.confirm("Are you sure you want to delete this task?")) {
    try {
      await deleteTask({ id: taskId });
      refetchTasks();
    } catch (error) {
      console.error(error);
    }
    // }
  };

  const onViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const statusGroups = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Done: tasks.filter((task) => task.status === "Done"),
  };

  return (
    <div className="container px-2 mx-auto my-10">
      <div>
        <Button
          onClick={() => setShowAddTask(true)}
          variant="primary"
          className="px-10"
        >
          Add Task
        </Button>
        <div className="flex flex-col items-start justify-between w-full gap-2 px-4 py-4 my-4 shadow-md md:items-center md:flex-row">
          <div className="flex items-center w-full gap-2">
            <p className="w-20 text-sm md:w-auto min-w-20 md:min-w-0">
              Search:
            </p>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              containerClass="w-full md:w-auto"
            />
          </div>
          <div className="flex items-center w-full gap-2 md:min-w-60 md:w-auto">
            <p className="w-20 text-sm md:min-w-0 min-w-20">Sort By:</p>
            <CustomSelect
              options={[
                { label: "Recent", value: "Recent" },
                { label: "Due Date", value: "Due Date" },
                { label: "Alphabetical", value: "Alphabetical" },
              ]}
              onChange={(option: { value: string }) => handleSort(option.value)}
              value={{ label: sortBy, value: sortBy }}
              className="mb-2 md:mb-0 md:ml-2"
            />
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-12 gap-4">
            {Object.entries(statusGroups).map(([status, tasks]) => (
              <TaskList
                key={status}
                status={status}
                tasks={tasks}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onViewTaskDetails={onViewTaskDetails}
              />
            ))}
          </div>
        </DragDropContext>

        {/* <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-12 gap-4">
            {filteredState.columnOrder.map((columnId) => {
              const column = filteredState.columns[columnId];
              const tasks = column.taskIds
                .map((taskId) => filteredState.tasks[taskId])
                .filter((task): task is Task => task !== undefined);

              return (
                <TaskColumn key={column.id} column={column} tasks={tasks} />
              );
            })}
          </div>
        </DragDropContext> */}
      </div>
      {showAddTask && (
        <Modal
          title="Add Task"
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
        >
          <form className="space-y-6" onSubmit={handleSubmit(onAddTask)}>
            <div>
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <Input
                {...register("title")}
                id="title"
                placeholder="Enter title"
                error={errors.title && errors.title.message}
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                placeholder="Enter description"
                rows={6}
                className="bg-white resize-none outline-none text-sm rounded-lg p-2.5 w-full focus:outline-none focus:border-gray-400 border"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="text-sm">
                Due Date
              </label>
              <Input
                {...register("dueDate")}
                id="dueDate"
                type="date"
                // error={errors.title && errors.title.message}s
                // error={errors.dueDate && errors.dueDate.message}
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="text-sm">
                Task Status
              </label>
              <CustomSelect
                options={[
                  { label: "To Do", value: "To Do" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Done", value: "Done" },
                ]}
                onChange={(val: any) => {
                  if (val) setValue("status", val.value);
                }}
                controlClasses="w-full"
              />
            </div>

            <Button className="justify-center w-full" variant="primary">
              Add Task
            </Button>
          </form>
        </Modal>
      )}
      {showEditTask && (
        <Modal
          title="Edit Task"
          isOpen={showEditTask}
          onClose={() => setShowEditTask(false)}
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmitEditTask)}>
            <div>
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <Input
                {...register("title")}
                id="title"
                placeholder="Enter title"
                error={errors.title && errors.title.message}
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <textarea
                {...register("description")}
                id="description"
                placeholder="Enter description"
                rows={6}
                className="bg-white resize-none outline-none text-sm rounded-lg p-2.5 w-full focus:outline-none focus:border-gray-400 border"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="text-sm">
                Due Date
              </label>
              <Input
                {...register("dueDate")}
                id="dueDate"
                type="date"
                value={selectedTask?.dueDate}
                // error={errors.title && errors.title.message}
                // error={errors.dueDate && errors.dueDate.message}
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="text-sm">
                Task Status
              </label>
              <CustomSelect
                options={[
                  { label: "To Do", value: "To Do" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Done", value: "Done" },
                ]}
                onChange={(val: any) => {
                  if (val) setValue("status", val.value);
                }}
                value={{
                  label: selectedTask?.status || "",
                  value: selectedTask?.status || "",
                }}
                controlClasses="w-full"
              />
            </div>
            <Button className="justify-center w-full" variant="primary">
              Save Task
            </Button>
          </form>
        </Modal>
      )}

      {/* View Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <Modal
          title="Task Details"
          isOpen={showTaskDetails}
          onClose={() => setShowTaskDetails(false)}
        >
          <div>
            <h2 className="text-xl font-bold"> {selectedTask.title}</h2>
            <p className="mt-2">Description: {selectedTask.description}</p>
            <p className="mt-2">Status: {selectedTask.status}</p>
            <p className="mt-2">
              Due Date: {new Date(selectedTask.dueDate).toLocaleDateString()}
            </p>
            <p className="mt-2">
              Created At: {new Date(selectedTask.createdAt).toLocaleString()}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TodoList;
