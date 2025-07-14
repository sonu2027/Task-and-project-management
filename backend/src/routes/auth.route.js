import { Router } from "express";
import {
  register,
  sendemailverificationcode,
  login
} from "../controllers/auth.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
// import { uploadImage } from "../controllers/image.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/sendemailverificationcode").post(sendemailverificationcode);
router.route("/login").post(login);
// router.route("/logout").post(logoutUser);
// router.route("/checkcookies").get(checkCookies);
// router.route("/changepassword").put(changePassword);
// router.route("/checkemailexistence").post(checkEmailExistence);
// router.route("/sendemailverificationcode").post(sendemailverificationcode);

export default router;
