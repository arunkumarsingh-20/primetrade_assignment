const prisma = require("../config/prisma");

const createTask = async (userId, data) => {
  const { title, description, status } = data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "TODO",
      userId
    }
  });

  return task;
};

const getTasks = async (user) => {
  if (user.role === "ADMIN") {
    return await prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  return await prisma.task.findMany({
    where: {
      userId: user.id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

const getTaskById = async (user, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== "ADMIN" && task.userId !== user.id) {
    const error = new Error("Forbidden: You can only access your own tasks");
    error.statusCode = 403;
    throw error;
  }

  return task;
};

const updateTask = async (user, taskId, data) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== "ADMIN" && task.userId !== user.id) {
    const error = new Error("Forbidden: You can only update your own tasks");
    error.statusCode = 403;
    throw error;
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data
  });

  return updatedTask;
};

const deleteTask = async (user, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== "ADMIN" && task.userId !== user.id) {
    const error = new Error("Forbidden: You can only delete your own tasks");
    error.statusCode = 403;
    throw error;
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  return { message: "Task deleted successfully" };
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
