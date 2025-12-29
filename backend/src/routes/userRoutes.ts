import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/userController";
import multer from "multer";

const router = express.Router();

// multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.array("documents"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);


export default router;