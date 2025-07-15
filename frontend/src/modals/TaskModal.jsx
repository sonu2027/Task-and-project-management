import React, { useState, useEffect } from "react";
import "./TaskModal.css";

const TaskModal = ({ project, onClose, onSuccess, existingData = null }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [error, setError] = useState("")

  useEffect(() => {
    if (existingData) {
      setForm({
        title: existingData.title || "",
        description: existingData.description || "",
        status: existingData.status || "todo",
        priority: existingData.priority || "medium",
        dueDate: existingData.dueDate ? existingData.dueDate.split("T")[0] : "",
      });
    }
  }, [existingData]);


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const url = existingData
      ? `${import.meta.env.VITE_API_URI}/api/tasks/${existingData._id}`
      : `${import.meta.env.VITE_API_URI}/api/tasks`;

    const method = existingData ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...form, project: project._id }),
      });

      const data = await response.json();
      onSuccess(data);
      onClose();
    } catch (err) {
      console.error("Task submission failed:", err);
    }
  };


  const validateForm = () => {
    const validateField = (value, fieldName, maxLength) => {
      const trimmed = value.trim();
      const words = trimmed.split(/\s+/);

      if (trimmed !== value) {
        setError(`${fieldName} should not have leading/trailing or multiple spaces.`);
        return false;
      }

      for (let word of words) {
        if (word.length > 25) {
          setError(`Each word in ${fieldName} must not exceed 25 characters.`);
          return false;
        }
      }

      if (trimmed.length > maxLength) {
        setError(`${fieldName} must not exceed ${maxLength} characters.`);
        return false;
      }

      return true;
    };

    if (
      !validateField(form.title, "Task Title", 40) ||
      !validateField(form.description, "Task Description", 120)
    ) {
      return false;
    }

    if (!form.dueDate) {
      setError("Please select a due date.");
      return false;
    }

    setError("");
    return true;
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content task-form">
        <h3>{existingData ? "Edit Task" : `Create Task for ${project.name}`}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="select-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="select-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />

          {error && <p id="error-text">{error}</p>}

          <div className="btn-group">
            <button type="submit">{existingData ? "Update Task" : "Create Task"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
