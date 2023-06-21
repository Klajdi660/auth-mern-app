import express from "express";
import { authService } from "../services/auth.js";
import { validation } from "../helpers/validation.js";
import { authenticate, localVariables, verifyUser } from "../middleware/authenticate.js";

const { authValidate } = validation;
const { login, validUser, logOut, generateOTP, sendPasswordLink } = authService;

const router = express.Router();

/** POST Methods */

// login in app
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

    const { token, cookieOptions } = response.data;

    res
        .status(200)
        .cookie("userCookie", token, cookieOptions)
        .json(response);
});

// user send link to reset password
router.post("/sendPasswordLink", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(401).json({ status: 401, error: true, message: "Enter Your Email" });
    }

    const response = await sendPasswordLink(email);

    if (response.error) { 
        console.error(`Error sendPassworLink: ${response.message}`);
        return res.status(500).json({ error: true, message: response.message });
    }

    res.status(200).json(response);
});

/** GET Methods */

// user valid
router.get("/validUser", authenticate, async (req, res) => {
    const response = await validUser(req.userId);

    if (response.error) {
        console.error(`Error Login: ${response.message}`);
        res.status(500).json({ status: 500, error: true, message: response.message });
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

router.get("/generateOTP", localVariables, async (req, res) => {
    const { OTP } = req.app.locals;

    const response = await generateOTP(OTP);

    if (response.error) { 
        console.error(`Error generateOTP: ${response.message}`);
        return res.status(500).json({ error: true, message: response.message });
    }
    
    res.status(200).json(response);
});

router.get("/verifyOTP", async (req, res) => {
    const { code } = req.query;
    // const { OTP, resetSession } = req.app.locals;
console.log('code :>> ', code);
// console.log('OTP :>> ', OTP);
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(200).json({ error: false, message: "Verify Successfully!"})
    }

    return res.status(400).json({ error: true, message: "Inavlid OTP" });
});

export default router;
