import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectsPage.css";
import ProjectModal from "../modals/ProjectModal.jsx";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import TaskModal from "../modals/TaskModal.jsx";
import TaskViewModal from "../modals/TaskViewModal.jsx";
import { jwtDecode } from "jwt-decode";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskProject, setTaskProject] = useState(null);
    const [taskViewModal, setTaskViewModal] = useState(false);
    const [taskViewProject, setTaskViewProject] = useState(null);

    const openTaskViewModal = (project) => {
        setTaskViewProject(project);
        setTaskViewModal(true);
    };

    const closeTaskViewModal = () => {
        setTaskViewProject(null);
        setTaskViewModal(false);
    };

    const openTaskModal = (project, e) => {
        e.stopPropagation()
        setTaskProject(project);
        setShowTaskModal(true);
    };

    const closeTaskModal = () => {
        setTaskProject(null);
        setShowTaskModal(false);
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URI}/api/projects`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error("Error fetching projects:", err));
    }, []);

    const handleEdit = (id, e) => {
        e.stopPropagation()
        const selected = projects.find((p) => p._id === id);
        setEditProject(selected);
        setShowModal(true);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }
        else {
            try {
                const decoded = jwtDecode(token);
                if (decoded.role === "user") {
                    navigate(-1);
                }
            } catch (err) {
                console.error("Token decode failed:", err);
                localStorage.removeItem("token");
            }
        }
    }, [])

    const handleCreateProject = () => {
        setShowModal(true);
    };

    const handleDeleteClick = (project, e) => {
        e.stopPropagation()
        setSelectedProject(project);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URI}/api/projects/${selectedProject._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProjects(projects.filter((p) => p._id !== selectedProject._id));
            setShowDeleteModal(false);
            setSelectedProject(null);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return (
        <div className="projects-wrapper">
            <div className="projects-header">
                <h2>Manage Projects 📁</h2>
                <button onClick={handleCreateProject}>➕ Create New Project</button>
            </div>

            <div className="project-list">
                {projects.map((project) => (
                    <div className="project-card" key={project._id} onClick={() => openTaskViewModal(project)}>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p><strong>Assigned Users:</strong> {project.assignedUsers?.length || 0}</p>
                        <div className="btn-group">
                            <div className="btn-group">
                                <button onClick={(e) => handleEdit(project._id, e)}>✏️ Edit</button>
                                <button onClick={(e) => handleDeleteClick(project, e)}>🗑️ Delete</button>
                                <button onClick={(e) => openTaskModal(project, e)}>➕ Add Task</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <ProjectModal
                    existingData={editProject}
                    onClose={() => {
                        setShowModal(false);
                        setEditProject(null);
                    }}
                    onSuccess={(newData) => {
                        if (editProject) {
                            setProjects((prev) =>
                                prev.map((p) => (p._id === newData._id ? newData : p))
                            );
                        } else {
                            setProjects((prev) => [...prev, newData]);
                        }
                        setShowModal(false);
                        setEditProject(null);
                    }}
                />
            )}
            {showDeleteModal && (
                <ConfirmDeleteModal
                    projectName={selectedProject.name}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedProject(null);
                    }}
                />
            )}

            {showTaskModal && (
                <TaskModal
                    project={taskProject}
                    onClose={closeTaskModal}
                    onSuccess={(createdTask) => {
                        console.log("New Task Created:", createdTask);
                        closeTaskModal();
                    }}
                />
            )}
            {taskViewModal && (
                <TaskViewModal
                    project={taskViewProject}
                    onClose={closeTaskViewModal}
                />
            )}

        </div>
    );
};

export default ProjectsPage;
