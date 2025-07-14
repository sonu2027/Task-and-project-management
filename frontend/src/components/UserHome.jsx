import React from "react";
import "./UserHome.css";

const UserHome = () => {
    return (
        <div className="user-home">
            <div className="home-wrapper">
                <h2>Welcome, User 👋</h2>
                <p>Here are your active tasks:</p>

                <div className="card">
                    <h3>Task Overview</h3>
                    <ul>
                        <li>Create dashboard wireframe</li>
                        <li>Fix login responsiveness</li>
                        <li>Update password reset flow</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
