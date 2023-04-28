import express from "express";
import { authController } from "../controllers/auth.js";
import authenticate from "../middleware/authenticate.js";

const { logIn, validUser, logOut } = authController;

const router = express.Router();

// user Login
router.post("/", logIn);

// user send link to reset password 
// router.post("/sendPasswordLink", sendPasswordLink);

// user valid
router.get("/validUser", authenticate, validUser);

// user Logout
router.get("/logout", authenticate, logOut);

export default router;
