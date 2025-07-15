import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="admin-home">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <h2>Admin Control Panel ⚙️</h2>
      <p>You have access to manage all users, projects, and tasks.</p>

      <div className="admin-actions">
        <div className="card" onClick={() => navigate("/projects")}>
          <h3>📁 Project Management</h3>
          <p>Create, edit or delete projects and assign users.</p>
          <button>Manage Projects</button>
        </div>

        {/* <div className="card" onClick={() => navigate("/users")}>
          <h3>👥 User Management</h3>
          <p>View all registered users and assign them to projects.</p>
          <button>View Users</button>
        </div> */}

        {/* <div className="card" onClick={() => navigate("/tasks")}>
          <h3>✅ Task Overview</h3>
          <p>Monitor all tasks across projects with status, priority, and due dates.</p>
          <button>View Tasks</button>
        </div> */}
      </div>
    </div>
  );
};

export default AdminHome;
