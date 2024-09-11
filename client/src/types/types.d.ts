interface OptionType {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: OptionType[];
  placeholder?: string;
  onChange: (selectedOption: OptionType | null) => void;
  controlClasses?: string;
  value?: OptionType | null;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate?: any;
  createdAt: string;
}

interface TaskColumn {
  id: string;
  title: string;
  taskIds: string[];
}

interface State {
  tasks: { [key: string]: Task };
  columns: { [key: string]: TaskColumn };
  columnOrder: string[];
}
