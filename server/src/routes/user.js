import express from "express";
import { userService } from "../services/user.js";
import { validation } from "../helpers/validation.js";

const { userRegister, userVerification } = userService;

const router = express.Router();

router.post("/register", async (req, res) => {
    const { firstName, lastName, email, username, password, passwordConfirm, agreedToTerms } = req.body;

    const data = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		username: username,
		password: password,
		passwordConfirm: passwordConfirm
	};

    const { error } = validation.userValidate(data);

    if (error) {
        return res.status(400).json({ error: true, message: error.details[0].message });
    }

    if (!agreedToTerms) {
        return res.status(400).json({ error: true, message: "You must agree to the terms and conditions to register." });
    }

    const response = await userRegister(firstName, lastName, email, username, password, passwordConfirm);

    if (response.error) {
        console.error(`Error User register: ${response.message}`);
        res.status(500).json({ error: true, message: response.message });
        return;
    }

    res.status(200).json(response);
});

router.get("/:id/verify", async (req, res) => {
    const { id } = req.params;
    const { token } = req.query;

    const response = await userVerification(id, token);

    if(response.error) {
        console.error(`Error User register: ${response.message}`);
        res.status(500).json({ error: true, message: response.message });
        return;
    }

    res.status(200).json(response);
});

export default router;