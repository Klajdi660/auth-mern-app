import express from "express";
import { authService } from "../services/auth.js";
import { validation } from "../helpers/validation.js";
import authenticate from "../middleware/authenticate.js";

const { authValidate } = validation;
const { login, validUser } = authService;

const router = express.Router();

// user login
router.post("/login", async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    
    const { error } = authValidate({ usernameOrEmail: usernameOrEmail, password: password });
    
    if (error) {
      return res.status(400).send({ error: true, message: error.details[0].message });
    }

    const response = await login(usernameOrEmail, password);

    if (response.error) {
        console.error(`Error Login: ${response.message}`);
        res.status(500).json({ error: true, message: response.message });
        return;
    }

    const { token, cookieOptions } = response.result;

    res
        .status(200)
        .cookie("userCookie", token, cookieOptions)
        .json(response);
});

// user send link to reset password
// router.post("/sendPasswordLink", sendPasswordLink);

// user valid
router.get("/validUser", authenticate, async (req, res) => {
    const response = await validUser(req.userId);

    if (response.error) {
        console.error(`Error Login: ${response.message}`);
        res.status(500).json({ error: true, message: response.message });
        return;
    }

    res.status(200).json(response);
});

// user Logout
router.get("/logout", authenticate, async (req, res) => {

    res
        .clearCookie("userCookie", {
            sameSite: "none",
            secure: true
        })
        .json({status: 201, error: false, message: "User has been logged out."})
});

export default router;
