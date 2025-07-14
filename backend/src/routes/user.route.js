import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", verifyToken, getAllUsers);

export default router;
