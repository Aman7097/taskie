/**
 * Task Routes
 *
 * Defines API routes for task-related operations.
 * All routes are protected by authentication middleware.
 */

const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

// Apply authentication check to all routes
router.use(authCheck);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get("/getAll", authCheck, taskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get("/:id", authCheck, taskController.getTask);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post("/create", authCheck, taskController.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Private
 */
router.put("/update/:id", authCheck, taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete("/delete/:id", authCheck, taskController.deleteTask);

module.exports = router;
