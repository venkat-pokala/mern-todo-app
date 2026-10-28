
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // Load tasks from MongoDB through the backend
  async function fetchTasks() {
    try {
      const response = await axios.get(API);
      setTasks(response.data);
      setError("");
    } catch (error) {
      setError("Unable to load tasks. Check your backend.");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      await axios.post(API, { title });
      setTitle("");
      await fetchTasks();
    } catch (error) {
      setError("Unable to add task.");
    }
  }

  // Complete or uncomplete a task
  async function toggleTask(task) {
    try {
      await axios.patch(`${API}/${task._id}`, {
        completed: !task.completed,
      });

      await fetchTasks();
    } catch (error) {
      setError("Unable to update task.");
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      await axios.delete(`${API}/${id}`);
      await fetchTasks();
    } catch (error) {
      setError("Unable to delete task.");
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="container">
      <h1>My Todo List</h1>
      <p className="subtitle">
        Organize your day, one task at a time.
      </p>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="summary">
        Total: {tasks.length} | Completed: {completedCount}
      </p>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <label className="task-label">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />

              <span className={task.completed ? "done" : ""}>
                {task.title}
              </span>
            </label>

            <button
              type="button"
              className="delete-btn"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="empty">
          No tasks yet. Add your first task!
        </p>
      )}
    </main>
  );
}

export default App;
