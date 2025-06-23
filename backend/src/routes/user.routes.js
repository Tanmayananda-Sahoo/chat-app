import { Router } from "express";
import { login, logout, signup, checkAuth } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { upload } from '../middlewares/multer.middleware.js'

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);

router.route("/update-profile").patch(verifyJWT, upload.single("profile"), updateProfile);
router.route("/check").get(verifyJWT,checkAuth);
export default router;