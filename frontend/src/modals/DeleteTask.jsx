
import "./DeleteTask.css";

const DeleteTask = ({ onClose, onConfirm }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h3>Are you sure you want to delete your task?</h3>
        <div className="delete-button-group">
          <button className="delete-btn" onClick={onConfirm}>Delete Task</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTask;
