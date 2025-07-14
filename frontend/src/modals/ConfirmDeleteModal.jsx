import React from "react";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ projectName, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content danger">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the project <strong>{projectName}</strong>? This will also delete all tasks under this project.</p>

        <div className="btn-group">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="delete-btn" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
