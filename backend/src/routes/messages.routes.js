import Router from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getUsers, getMessages, sendMessage } from '../controllers/messages.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
const router = Router();

router.route("/users").get(verifyJWT, getUsers);  //To fetch the users for the sidebars.
router.route("/:id").get(verifyJWT, getMessages); //To fetch the messages between two users.
router.route("/send/:id").post(verifyJWT, upload.single('image'), sendMessage);
export default router;
