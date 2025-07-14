import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Optional if you prefer SCSS
import VerifyModal from "../modals/VerifyModal.jsx";
import sendEmailVerificationCode from "../apiCall/senEmailverificationOtp.js";
import registerUser from "../apiCall/registerUser.js";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showModal, setShowModal] = useState(false);
  const [otpCode, setOtpCode] = useState(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendEmailVerificationCode(formData.email);
      setOtpCode(res);
      setShowModal(true);
      toast.success("OTP successfully sent to your email")
    } catch {
      setError("Failed to send verification code");
      toast.error("Something wnet wrong while sending otp, please try again")
    }
  };


  const onSuccess = async () => {
    const result = await registerUser(formData);

    if (result.userExist) {
      setError("User already exists");
      toast.error("User already exist")
    } else if (result.token) {
      localStorage.setItem("token", result.token);
      toast.success("Registration successfull")
      navigate("/home");
    } else {
      setError("Something went wrong");
      toast.error("something went wrong while regustring, please try again")
    }
  }

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

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

        <div className="input-group">
          <label>Role</label>
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}
        <button className="submit-btn" type="submit">Sign Up</button>
      </form>
      {showModal && (
        <VerifyModal
          correctOtp={otpCode}
          onSuccess={onSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Register;
