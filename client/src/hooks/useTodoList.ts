// import { useState, useMemo, useCallback } from "react";
// import { DropResult } from "@hello-pangea/dnd";
// import { initialTasks } from "../utils/constants";

// const useTodoList = () => {
//   const [state, setState] = useState<State>(initialTasks);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const filteredState = useMemo(() => {
//     if (!searchTerm.trim()) return state;

//     const lowercasedSearch = searchTerm.toLowerCase();

//     const filteredTasks = Object.fromEntries(
//       Object.entries(state.tasks).filter(
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         ([_, task]) =>
//           task.title.toLowerCase().includes(lowercasedSearch) ||
//           task.description.toLowerCase().includes(lowercasedSearch)
//       )
//     );

//     const filteredColumns = Object.fromEntries(
//       Object.entries(state.columns).map(([columnId, column]) => [
//         columnId,
//         {
//           ...column,
//           taskIds: column.taskIds.filter((taskId) => taskId in filteredTasks),
//         },
//       ])
//     );

//     return {
//       ...state,
//       tasks: filteredTasks,
//       columns: filteredColumns,
//     };
//   }, [state, searchTerm]);

//   const onDragEnd = useCallback((result: DropResult) => {
//     const { destination, source, draggableId } = result;

//     if (!destination) {
//       return;
//     }

//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     ) {
//       return;
//     }

//     setState((prevState) => {
//       const startColumn = prevState.columns[source.droppableId];
//       const finishColumn = prevState.columns[destination.droppableId];

//       if (startColumn === finishColumn) {
//         const newTaskIds = Array.from(startColumn.taskIds);
//         newTaskIds.splice(source.index, 1);
//         newTaskIds.splice(destination.index, 0, draggableId);

//         const newColumn = {
//           ...startColumn,
//           taskIds: newTaskIds,
//         };

//         return {
//           ...prevState,
//           columns: {
//             ...prevState.columns,
//             [newColumn.id]: newColumn,
//           },
//         };
//       }

//       // Moving from one list to another
//       const startTaskIds = Array.from(startColumn.taskIds);
//       startTaskIds.splice(source.index, 1);
//       const newStartColumn = {
//         ...startColumn,
//         taskIds: startTaskIds,
//       };

//       const finishTaskIds = Array.from(finishColumn.taskIds);
//       finishTaskIds.splice(destination.index, 0, draggableId);
//       const newFinishColumn = {
//         ...finishColumn,
//         taskIds: finishTaskIds,
//       };

//       return {
//         ...prevState,
//         columns: {
//           ...prevState.columns,
//           [newStartColumn.id]: newStartColumn,
//           [newFinishColumn.id]: newFinishColumn,
//         },
//       };
//     });
//   }, []);

//   const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   }, []);

//   return {
//     state,
//     setState,
//     filteredState,
//     searchTerm,
//     onDragEnd,
//     handleSearch,
//   };
// };

// export default useTodoList;

import { useState, useEffect, useCallback } from "react";
import { getTasks, updateTask } from "../api/axios";
import { Task } from "../types/types";

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
