import express from "express";
import { authController } from "../controllers/auth.js";
import authenticate from "../middleware/authenticate.js";

const { logIn, sendPasswordLink, logOut } = authController;

const router = express.Router();

// user Login
router.post("/login", logIn);

// user send link to reset password 
router.post("/sendPasswordLink", sendPasswordLink);

// user Logout
router.get("/logout", authenticate, logOut);

export default router;
