import { Router } from "express";
import { createProject, getProjects, updateProject, deleteProject } from "../controllers/project.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-projects", verifyToken, isAdmin, createProject);
router.get("/projects", verifyToken, isAdmin, getProjects);
router.put("/projects/:id", verifyToken, isAdmin, updateProject);
router.delete("/projects/:id", verifyToken, isAdmin, deleteProject);

export default router;
