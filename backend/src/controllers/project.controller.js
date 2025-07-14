import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, assignedUsers } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    console.log(req.body);

    const newProject = await Project.create({
      name,
      description,
      assignedUsers: assignedUsers || [],
      createdBy: req.user._id,
    });

    console.log(newProject);

    res.status(201).json(newProject);
  } catch (error) {
    console.error("CreateProject Error:", error);
    res.status(500).json({ message: "Failed to create project", error });
  }
};
export const getProjects = async (req, res) => {
  console.log("hello");
  
  try {
    let projects;

    // 🛡️ If user is admin — fetch all projects
    if (req.user.role === "admin") {
      projects = await Project.find()
        .populate("assignedUsers", "name email")
        .populate("createdBy", "name");
    } else {
      // 👤 If normal user — fetch only assigned projects
      projects = await Project.find({ assignedUsers: req.user._id })
        .populate("assignedUsers", "name email")
        .populate("createdBy", "name");
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("FetchProjects Error:", error);
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, assignedUsers } = req.body;

    // 🔍 Check if project exists
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🛡️ Optional: Ensure only admins can edit
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✏️ Update fields
    existingProject.name = name || existingProject.name;
    existingProject.description = description || existingProject.description;
    existingProject.assignedUsers = Array.isArray(assignedUsers)
      ? assignedUsers
      : existingProject.assignedUsers;

    const updatedProject = await existingProject.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("UpdateProject Error:", error);
    res.status(500).json({ message: "Failed to update project", error });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🛡️ Authorization check (optional if handled in middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🧹 Delete all tasks under this project
    await Task.deleteMany({ project: id });

    // 🗑️ Delete the project itself
    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project and related tasks deleted successfully" });
  } catch (error) {
    console.error("DeleteProject Error:", error);
    res.status(500).json({ message: "Failed to delete project", error });
  }
};
