// src/api/api.ts

import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Types
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate: string;
  column: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate?: string;
}
interface GetTasksParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface LoginData {
  email: string;
  password: string;
}

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<T>): T => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  if (response.status === 400) {
    return response.data;
  }
  throw new Error(`API error: ${response.status} ${response.statusText}`);
};

// API functions
export const userLogin = async ({
  email,
  password,
}: LoginData): Promise<{ token: string; user: any; message?: string }> => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;

    // Save token to localStorage
    localStorage.setItem("token", data.token);

    // Save user info to localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    // You might want to set up the authorization header for future requests here
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const userRegister = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}: RegisterData): Promise<{ token: string; user: any; message?: string }> => {
  try {
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
    return handleResponse(response);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error("Invalid credentials");
      }
    }
    console.error("Error during login:", error);
    throw error;
  }
};

export const userLogout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete api.defaults.headers.common["Authorization"];
};

export const googleSignIn = async (accessToken: string) => {
  try {
    const response = await api.post("/auth/google", {
      accessToken,
    });
    const data = response.data;

    // Save token to localStorage
    localStorage.setItem("token", data.token);

    // Save user info to localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    // You might want to set up the authorization header for future requests here
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    return data;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};
// For Tasks:

export const getTasks = async (params: GetTasksParams = {}): Promise<any> => {
  try {
    const { search, status, sortBy = "Recent" } = params;

    const response = await api.get("/tasks/getAll", {
      params: {
        search,
        status,
        sortBy,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTask = async ({ id }: { id: string }): Promise<Task> => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

export const createTask = async ({
  title,
  description,
  status,
  dueDate,
}: CreateTaskDto): Promise<Task> => {
  try {
    const response = await api.post("/tasks/create", {
      title,
      description,
      status,
      dueDate,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (
  id: string,
  updateData: Partial<CreateTaskDto>
): Promise<Task> => {
  try {
    const response = await api.put(`/tasks/update/${id}`, updateData);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async ({ id }: { id: string }): Promise<void> => {
  try {
    const response = await api.delete(`/tasks/delete/${id}`);
    handleResponse(response);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};

export const searchTasks = async ({
  query,
}: {
  query: string;
}): Promise<Task[]> => {
  try {
    const response = await api.get("/tasks/search", {
      params: { query },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error searching tasks:", error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await api.get("/users/profile");
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async ({
  firstName,
  lastName,
  email,
}: Partial<any>): Promise<any> => {
  try {
    const response = await api.put("/users/profile", {
      firstName,
      lastName,
      email,
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserAvatar = async ({
  avatarFile,
}: {
  avatarFile: File;
}): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    const response = await api.patch("/users/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error updating user avatar:", error);
    throw error;
  }
};

export default api;
