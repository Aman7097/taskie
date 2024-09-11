/**
 * Task Controller
 *
 * This module handles CRUD operations for tasks, including creation,
 * retrieval, updating, deletion, and searching.
 */

const Task = require("../models/TaskModel");
const { validationResult } = require("express-validator");

/**
 * Create a new task

 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      owner: req.user.id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

/**
 * Get all tasks for the current user

 */
exports.getTasks = async (req, res) => {
  try {
    const { search, sortBy = "createdAt" } = req.query;
    const query = { owner: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    switch (sortBy) {
      case "Recent":
        sort = { createdAt: -1 };
        break;
      case "Due Date":
        sort = { dueDate: 1 }; // Ascending order for due dates
        break;
      case "Alphabetical":
        sort = { title: 1 }; // Ascending order for alphabetical sorting
        break;
      default:
        sort = { createdAt: -1 }; // Default to Recent
    }
    const tasks = await Task.find(query).sort(sort).exec();

    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

/**
 * Get a specific task by ID

 */
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};

/**
 * Update a task
 */
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, status, dueDate, order } = req.body;
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, dueDate, order },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

/**
 * Delete a task

 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Task removed" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};
