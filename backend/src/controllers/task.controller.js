import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;

    // 🛡️ Input validation
    if (!title || !project) {
      return res.status(400).json({ message: "Task title and project ID are required" });
    }

    // 🔍 Project lookup
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔐 Access control
    if (req.user.role === "user") {
      const isAssigned = projectDoc.assignedUsers.includes(req.user._id);
      if (!isAssigned) {
        return res.status(403).json({ message: "You are not assigned to this project" });
      }
    }

    // ✅ Create task
    const newTask = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      project,
      createdBy: req.user._id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("createTask Error:", error);
    res.status(500).json({ message: "Failed to create task", error });
  }
};