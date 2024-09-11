import { useState, useEffect, useCallback } from "react";
import { getTasks, updateTask } from "../api/axios";

const useTodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Recent");

  const fetchTasks = useCallback(async () => {
    try {
      const response = await getTasks({
        search: searchTerm,
        sortBy,
      });
      setTasks(response.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [searchTerm, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination, or if the task was dropped back in its original position, do nothing
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    try {
      // Update the task's status
      await updateTask(draggableId, { status: destination.droppableId });

      // Refetch tasks to update the UI
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      // Optionally, show an error message to the user
      // For example: setErrorMessage('Failed to update task status. Please try again.');
    }
  };

  return {
    tasks,
    searchTerm,
    sortBy,
    handleSearch,
    handleSort,
    onDragEnd,
    refetchTasks: fetchTasks,
  };
};

export default useTodoList;
