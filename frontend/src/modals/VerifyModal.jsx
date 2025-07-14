import React, { useRef, useState } from "react";
import "./VerifyModal.css";
import toast from "react-hot-toast";

const VerifyModal = ({ correctOtp, onSuccess, onClose }) => {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const inputsRef = Array.from({ length: 4 }, () => useRef(null));

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    if (value && index < 3) {
      inputsRef[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef[index - 1].current.focus();
    }
  };

  const handleSubmit = () => {
    const code = otpValues.join("");
    if (code === correctOtp.toString()) {
      onSuccess();
    } else {
      toast.error("Incorrect code. Try again.")
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Email Verification</h3>
        <p>Enter the 4-digit code sent to your email</p>

        <div className="otp-wrapper">
          {otpValues.map((val, index) => (
            <input
              key={index}
              ref={inputsRef[index]}
              type="text"
              maxLength="1"
              value={val}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputMode="numeric"
              className="otp-input"
            />
          ))}
        </div>

        <button className="verify-btn" onClick={handleSubmit}>
          Verify
        </button>
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerifyModal;
