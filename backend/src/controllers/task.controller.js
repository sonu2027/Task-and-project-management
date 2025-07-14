import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;

    if (!title || !project) {
      return res
        .status(400)
        .json({ message: "Task title and project ID are required" });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role === "user") {
      const isAssigned = projectDoc.assignedUsers.includes(req.user._id);
      if (!isAssigned) {
        return res
          .status(403)
          .json({ message: "You are not assigned to this project" });
      }
    }

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

export const getTasksByProject = async (req, res) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAssignedUser = projectDoc.assignedUsers.includes(req.user._id);
    if (!isAssignedUser && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ project }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GetTasks Error:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, project } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAssignedUser = projectDoc.assignedUsers.includes(req.user._id);
    if (!isAssignedUser && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this task" });
    }

    task.title = title || task.title;
    task.description = description ?? task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("UpdateTask Error:", error);
    res.status(500).json({ message: "Failed to update task", error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const projectDoc = await Project.findById(task.project);
    if (!projectDoc) {
      return res.status(404).json({ message: "Associated project not found" });
    }

    const isAssigned = projectDoc.assignedUsers.includes(req.user._id);

    if (!isAssigned && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DeleteTask Error:", error);
    res.status(500).json({ message: "Failed to delete task", error });
  }
};