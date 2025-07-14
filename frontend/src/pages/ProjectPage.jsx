import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectsPage.css";
import ProjectModal from "../modals/ProjectModal.jsx";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import TaskModal from "../modals/TaskModal.jsx";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskProject, setTaskProject] = useState(null);

    const openTaskModal = (project) => {
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

    const handleEdit = (id) => {
        const selected = projects.find((p) => p._id === id);
        setEditProject(selected);
        setShowModal(true);
    };


    const handleDelete = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URI}/api/projects/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProjects(projects.filter((p) => p._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleCreateProject = () => {
        setShowModal(true);
    };

    const handleDeleteClick = (project) => {
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
                    <div className="project-card" key={project._id}>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p><strong>Assigned Users:</strong> {project.assignedUsers?.length || 0}</p>
                        <div className="btn-group">
                            {/* <button onClick={() => handleEdit(project._id)}>✏️ Edit</button>
                            <button onClick={() => handleDeleteClick(project)}>🗑️ Delete</button> */}
                            <div className="btn-group">
                                <button onClick={() => handleEdit(project._id)}>✏️ Edit</button>
                                <button onClick={() => handleDeleteClick(project)}>🗑️ Delete</button>
                                <button onClick={() => openTaskModal(project)}>➕ Add Task</button>
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
                            // Update existing
                            setProjects((prev) =>
                                prev.map((p) => (p._id === newData._id ? newData : p))
                            );
                        } else {
                            // New project
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

        </div>
    );
};

export default ProjectsPage;
