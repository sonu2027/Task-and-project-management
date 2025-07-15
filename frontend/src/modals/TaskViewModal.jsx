import { useEffect, useState } from "react";
import "./TaskViewModal.css";
import TaskModal from "./TaskModal.jsx";
import DeleteTask from "./DeleteTask.jsx";
import toast from "react-hot-toast"

const TaskViewModal = ({ project, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/api/tasks?project=${project._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Failed to fetch tasks:", err))
      .finally(() => setLoading(false));
  }, [project]);

  const openEditModal = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditTask(null);
    setShowEditModal(false);
  };

  const handleDelete = async (taskId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URI}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully")
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Task deletion failed")
    }
    setTaskToDelete(null)
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-view-modal">
        <h3>Tasks for <span>{project.name}</span></h3>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet for this project.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task._id}>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <p>Status: <strong>{task.status}</strong></p>
                  <p>Priority: <strong>{task.priority}</strong></p>
                  <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="task-actions">
                  <button onClick={() => openEditModal(task)}>✏️ Edit</button>
                  <button onClick={() => setTaskToDelete(task)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      {showEditModal && (
        <TaskModal
          project={project}
          existingData={editTask}
          onClose={closeEditModal}
          onSuccess={(updatedTask) => {
            setTasks((prev) =>
              prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
            closeEditModal();
          }}
        />
      )}

      {taskToDelete && (
        <DeleteTask
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => handleDelete(taskToDelete._id)}
        />
      )}

    </div>
  );
};

export default TaskViewModal;
