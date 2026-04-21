const { createTaskSchema, updateTaskSchema } = require("../validations/task.validation");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../services/task.service");

const createTaskController = async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((err) => err.message)
      });
    }

    const task = await createTask(req.user.id, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

const getTasksController = async (req, res, next) => {
  try {
    const tasks = await getTasks(req.user);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.user, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskController = async (req, res, next) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((err) => err.message)
      });
    }

    const task = await updateTask(req.user, req.params.id, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

const deleteTaskController = async (req, res, next) => {
  try {
    const result = await deleteTask(req.user, req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController
};
