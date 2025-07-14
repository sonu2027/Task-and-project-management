import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getTasksByProject, updateTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/tasks", verifyToken, createTask);
router.get("/tasks", verifyToken, getTasksByProject);
router.put("/tasks/:id", verifyToken, updateTask);
router.delete("/tasks/:id", verifyToken, deleteTask);
export default router;