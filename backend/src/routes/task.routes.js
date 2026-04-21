const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController
} = require("../controllers/task.controller");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user or all tasks for admin
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", getTasksController);

/**
 * @openapi
 * /api/v1/tasks/admin/all:
 *   get:
 *     summary: Admin-only route to view all tasks
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       403:
 *         description: Forbidden
 */
router.get("/admin/all", roleMiddleware("ADMIN"), getTasksController);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.get("/:id", getTaskByIdController);

/**
 * @openapi
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish backend assignment
 *               description:
 *                 type: string
 *                 example: Complete auth and CRUD
 *               status:
 *                 type: string
 *                 example: TODO
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation failed
 */
router.post("/", createTaskController);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.put("/:id", updateTaskController);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.delete("/:id", deleteTaskController);

module.exports = router;
