import express from "express";
import { authController } from "../controllers/auth.js";
import authenticate from "../middleware/authenticate.js";
// import { verifyUser } from "../middleware/authenticate.js";
const { logIn, validUser, logOut, generateOTP } = authController;

const router = express.Router();

// user Login
router.post("/", logIn);

// user send link to reset password 
// router.post("/sendPasswordLink", sendPasswordLink);

// user valid
router.get("/validUser", authenticate, validUser);

// user Logout
router.get("/logout", authenticate, logOut);

router.get("/generateOTP", generateOTP);

export default router;
