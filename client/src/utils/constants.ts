export const initialTasks: State = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Implement login functionality",
      description: "Create login form and integrate with backend API",
      createdAt: "01/09/2024",
    },
    "task-2": {
      id: "task-2",
      title: "Design dashboard layout",
      description: "Create wireframes for the main dashboard",
      createdAt: "02/09/2024",
    },
    "task-3": {
      id: "task-3",
      title: "Set up CI/CD pipeline",
      description: "Configure Jenkins for automated testing and deployment",
      createdAt: "03/09/2024",
    },
    "task-4": {
      id: "task-4",
      title: "Optimize database queries",
      description: "Improve performance of slow database queries",
      createdAt: "04/09/2024",
    },
    "task-5": {
      id: "task-5",
      title: "Implement user settings page",
      description: "Create a page for users to manage their account settings",
      createdAt: "05/09/2024",
    },
    "task-6": {
      id: "task-6",
      title: "Write user documentation",
      description: "Create comprehensive user guide for the application",
      createdAt: "06/09/2024",
    },
  },
  columns: {
    pending: {
      id: "pending",
      title: "TODO",
      taskIds: ["task-1", "task-2"],
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      taskIds: ["task-3", "task-4"],
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: ["task-5", "task-6"],
    },
  },
  columnOrder: ["pending", "in-progress", "done"],
};
