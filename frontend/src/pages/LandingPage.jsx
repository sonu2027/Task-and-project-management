import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import {jwtDecode} from "jwt-decode";

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp * 1000 < Date.now();
                 
                if (!isExpired) {
                    navigate("/home"); 
                } else {
                    localStorage.removeItem("token"); 
                }
            } catch (err) {
                console.error("Token decoding failed:", err);
                localStorage.removeItem("token");
            }
        }
    }, [navigate]);

    return (
        <div className="landing-wrapper">
            <h1>🔧 Task & Project Management Platform</h1>
            <p>
                Manage your team’s projects and tasks in one place. This MERN stack platform features full user authentication,
                role-based access, and clean interfaces for organizing everything from deadlines to priorities.
            </p>

            <div className="features">
                <div>
                    <h3>👥 User Roles</h3>
                    <p>Admins & Users with separate dashboards and permissions.</p>
                </div>
                <div>
                    <h3>📁 Projects</h3>
                    <p>Assign users, manage lifecycle, and track progress cleanly.</p>
                </div>
                <div>
                    <h3>✅ Tasks</h3>
                    <p>CRUD tasks inside projects with priority, due dates, and status updates.</p>
                </div>
            </div>

            <div className="actions">
                <button onClick={() => navigate("/login")}>🔑 Login</button>
                <button onClick={() => navigate("/register")}>📝 Register</button>
            </div>
        </div>
    );
};

export default LandingPage;
