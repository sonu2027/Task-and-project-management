import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginUser from "../apiCall/loginUser.js"; 
import toast from "react-hot-toast"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(formData);

    if (result.error) {
      toast.error("Invalid credentials")
    } else {
      localStorage.setItem("token", result.token);
      navigate("/home");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>
        <button className="submit-btn" type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
