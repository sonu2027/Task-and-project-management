import { Router } from "express";
import {
  register,
  sendemailverificationcode,
  login
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/sendemailverificationcode").post(sendemailverificationcode);
router.route("/login").post(login);

export default router;
