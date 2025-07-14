import React, { useState, useEffect } from "react";
import "./ProjectModal.css";

const ProjectModal = ({ onClose, onSuccess, existingData = null }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    assignedUsers: [],
  });
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (existingData) {
      setForm({
        name: existingData.name || "",
        description: existingData.description || "",
        assignedUsers: existingData.assignedUsers?.map(u => u._id) || [],
      });
    }

    fetch(`${import.meta.env.VITE_API_URI}/api/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setUserOptions(data))
      .catch(err => console.error("Error fetching users:", err));
  }, [existingData]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUserToggle = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = existingData
      ? `${import.meta.env.VITE_API_URI}/api/projects/${existingData._id}`
      : `${import.meta.env.VITE_API_URI}/api/create-projects`;

    const method = existingData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      onSuccess(result);
    } catch (err) {
      console.error("Project action failed:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{existingData ? "Edit Project" : "Create Project"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="users-list">
            {userOptions.map((user) => (
              <label key={user._id}>
                <input
                  type="checkbox"
                  checked={form.assignedUsers.includes(user._id)}
                  onChange={() => handleUserToggle(user._id)}
                />
                {user.name}
              </label>
            ))}
          </div>

          <button type="submit">{existingData ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;