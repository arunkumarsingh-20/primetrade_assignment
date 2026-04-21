import { useEffect, useState } from "react";

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO"
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "TODO"
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "TODO"
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className={`panel ${editingTask ? "panel--editing" : ""}`}>
      <div className="panel__header">
        <div>
          <span className="eyebrow">{editingTask ? "Editing mode" : "New task"}</span>
          <h3>{editingTask ? "Update task" : "Create task"}</h3>
        </div>
        <p className="panel__text">
          Keep your work organized with a simple, focused task editor.
        </p>
      </div>

      {editingTask && (
        <div className="edit-banner">
          Editing: <strong>{editingTask.title}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form form--spacious">
        <label className="field">
          <span className="field__label">Title</span>
          <input
            type="text"
            name="title"
            placeholder="Finish backend assignment"
            value={formData.title}
            onChange={handleChange}
            className="input"
          />
        </label>

        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            name="description"
            placeholder="Add a short note..."
            value={formData.description}
            onChange={handleChange}
            className="textarea"
          />
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input select"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </label>

        <div className="button-row">
          <button type="submit" className="button button--primary">
            {editingTask ? "Update task" : "Create task"}
          </button>

          {editingTask && (
            <button type="button" onClick={onCancel} className="button button--secondary">
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
