import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/tasks", verifyToken, createTask);

export default router;