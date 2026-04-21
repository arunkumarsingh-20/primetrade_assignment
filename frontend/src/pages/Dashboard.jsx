import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard({ user: initialUser }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [user, setUser] = useState(initialUser || null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTasks = async (currentUser) => {
    const endpoint = currentUser?.role === "ADMIN" ? "/tasks/admin/all" : "/tasks";
    const response = await api.get(endpoint);
    return response.data.data || [];
  };

  useEffect(() => {
    let mounted = true;

    const loadTasks = async () => {
      try {
        setLoadingTasks(true);

        const currentUser = initialUser || user || (await api.get("/auth/me")).data.data;
        if (!mounted) return;

        setUser(currentUser);

        const userTasks = await fetchTasks(currentUser);
        if (!mounted) return;

        setTasks(userTasks);
      } catch (err) {
        if (!mounted) return;
        navigate("/login");
      } finally {
        if (mounted) setLoadingTasks(false);
      }
    };

    loadTasks();

    return () => {
      mounted = false;
    };
  }, [initialUser, navigate]);

  const stats = useMemo(() => {
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const done = tasks.filter((task) => task.status === "DONE").length;

    return [
      { label: "Total tasks", value: tasks.length },
      { label: "In progress", value: inProgress },
      { label: "Completed", value: done }
    ];
  }, [tasks]);

  const refreshTasks = async (currentUser) => {
    const userToUse = currentUser || user;
    const latestTasks = await fetchTasks(userToUse);
    setTasks(latestTasks);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      setError("Logout failed");
    }
  };

  const handleTaskSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData);
        setMessage("Task updated successfully");
      } else {
        await api.post("/tasks", formData);
        setMessage("Task created successfully");
      }

      setEditingTask(null);
      await refreshTasks();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Task operation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      setError("");
      setMessage("");
      await api.delete(`/tasks/${taskId}`);
      setMessage("Task deleted successfully");
      await refreshTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setMessage("");
    setError("");

    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <section className="dashboard">
      <header className="dashboard__hero">
        <div>
          <span className="eyebrow">Workspace overview</span>
          <h1 className="dashboard__title">
            Hello{user ? `, ${user.name}` : ""}.
          </h1>
          <p className="dashboard__subtitle">
            Manage your tasks in a focused workspace designed for speed, clarity, and calm.
          </p>
        </div>

        <div className="dashboard__hero-actions">
          <div className="role-chip">
            {user?.role === "ADMIN" ? "Admin account" : "Personal account"}
          </div>
          <button onClick={handleLogout} className="button button--secondary">
            Logout
          </button>
        </div>
      </header>

      {message && <div className="notice notice--success">{message}</div>}
      {error && <div className="notice notice--error">{error}</div>}

      <div className="dashboard__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-card__label">{stat.label}</span>
            <strong className="stat-card__value">{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="dashboard__grid">
        <div className="dashboard__column" ref={formRef}>
          <TaskForm
            onSubmit={handleTaskSubmit}
            editingTask={editingTask}
            onCancel={handleCancelEdit}
          />
        </div>

        <div className="dashboard__column">
          <section className="panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Task list</span>
                <h3>Your tasks</h3>
              </div>
              <p className="panel__text">
                Update progress, edit details, or remove completed items.
              </p>
            </div>

            {loadingTasks ? (
              <div className="loading-inline">Loading tasks...</div>
            ) : (
              <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </section>
        </div>
      </div>

      {saving && <div className="saving-pill">Saving changes...</div>}
    </section>
  );
}

export default Dashboard;
