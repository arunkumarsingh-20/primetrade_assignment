function getStatusClass(status) {
  const value = String(status || "").toLowerCase();

  if (value === "done") return "status-pill status-pill--done";
  if (value === "in_progress") return "status-pill status-pill--progress";
  return "status-pill status-pill--todo";
}

function formatDate(value) {
  if (!value) return "Recently updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Create your first task to begin tracking progress.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article key={task.id} className="task-card">
          <div className="task-card__top">
            <div>
              <h3 className="task-card__title">{task.title}</h3>
              <p className="task-card__description">
                {task.description || "No description provided."}
              </p>
            </div>

            <span className={getStatusClass(task.status)}>
              {task.status}
            </span>
          </div>

          <div className="task-card__meta">
            <span>Owner: {task.user?.name || "N/A"}</span>
            <span>Updated: {formatDate(task.updatedAt)}</span>
          </div>

          <div className="button-row button-row--task">
            <button onClick={() => onEdit(task)} className="button button--secondary">
              Edit
            </button>
            <button onClick={() => onDelete(task.id)} className="button button--danger">
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default TaskList;
