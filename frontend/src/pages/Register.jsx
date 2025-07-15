import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
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
  const [showLoader, setShowLoader] = useState(false)

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect executed");

    const token = localStorage.getItem("token");
    console.log(token);


    if (token) {
      navigate("/home");
      return;
    }
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setShowLoader(true);
    try {
      const res = await sendEmailVerificationCode(formData.email);
      setOtpCode(res);
      setShowModal(true);
      toast.success("OTP successfully sent to your email");
    } catch {
      setError("Failed to send verification code");
      toast.error("Something went wrong while sending OTP, please try again");
    } finally {
      setShowLoader(false);
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

  const validateForm = () => {
    const { name, email, password } = formData;

    const trimmedName = name.trim();
    const nameRegex = /^[A-Za-z]{3,} [A-Za-z]{3,}$/; // Only one space, both parts min 3 letters

    if (!nameRegex.test(trimmedName)) {
      setError("Name must be two words (min 3 characters each) with one space only");
      return false;
    }

    if (trimmedName.length > 30) {
      setError("Full name must be at most 30 characters including space");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (email.length > 50) {
      setError("Email must not exceed 50 characters");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character, and contain no spaces"
      );
      return false;
    }

    if(password.length>20){
      setError("Password length should not exceed more than 20")
      return false
    }

    setError("");
    return true;
  };


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
        {
          showLoader ?
            <div className="loader-container">
              <button className="loader" disabled></button>
            </div>

            :
            <button className="submit-btn" type="submit">Sign Up</button>
        }
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
