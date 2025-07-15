import { useEffect, useState } from "react";
import "./UserHome.css";
import "../pages/ProjectsPage.css";
import TaskViewModal from "../modals/TaskViewModal.jsx";
import TaskModal from "../modals/TaskModal.jsx";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [taskViewModal, setTaskViewModal] = useState(false);
    const [taskViewProject, setTaskViewProject] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskProject, setTaskProject] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URI}/api/user-projects`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching assigned projects:", err))
            .finally(() => setLoading(false));
    }, []);

    const openTaskViewModal = (project) => {
        setTaskViewProject(project);
        setTaskViewModal(true);
    };

    const openTaskModal = (project, e) => {
        e.stopPropagation()
        setTaskProject(project);
        setShowTaskModal(true);
    };

    const closeTaskViewModal = () => {
        setTaskViewProject(null);
        setTaskViewModal(false);
    };

    const closeTaskModal = () => {
        setTaskProject(null);
        setShowTaskModal(false);
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="user-home-wrapper">
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <h2>Your Assigned Projects 🧑‍💻</h2>

            {loading ? (
                <p>Loading...</p>
            ) : projects.length === 0 ? (
                <p>No projects assigned to you yet.</p>
            ) : (
                <div className="project-list">
                    {projects.map((project) => (
                        <div className="project-card" key={project._id} onClick={() => openTaskViewModal(project)}>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <p><strong>Assigned Users:</strong> {project.assignedUsers?.length || 0}</p>
                            <div className="btn-group">
                                <div className="btn-group">
                                    <button onClick={(e) => openTaskModal(project, e)}>➕ Add Task</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {taskViewModal && (
                <TaskViewModal
                    project={taskViewProject}
                    onClose={closeTaskViewModal}
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

export default UserHome;
