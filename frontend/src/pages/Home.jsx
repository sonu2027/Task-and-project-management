import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserHome from "../components/UserHome";
import AdminHome from "../components/AdminHome";

const Home = () => {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
        } catch (err) {
            console.error("Invalid token", err);
            navigate("/login");
        }
    }, []);

    return (
        <div>
            {role === "admin" && <AdminHome />}
            {role === "user" && <UserHome />}
        </div>
    );
};

export default Home;
