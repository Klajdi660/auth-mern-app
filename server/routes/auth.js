import express from "express";
import bcrypt from "bcrypt";
import sendConfirmationEmail from "../utils/sendEmail.js";
import connection from "../db.js";
import { userModel } from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const { email, password } = req.body;
    
	try {
		const { error } = userModel.authValidate(req.body);
    
		if (error) {
			return res.status(400).send({ error: true, message: error.details[0].message });
		}

        connection.query('SELECT * FROM register WHERE email = ?', [email], async (err, results) => {
			const user = results[0];
			
			if (!user) {
				return res.status(401).send({ error: true, message: "Invalid Email or Password!" });
		    }

			const validPassword = await bcrypt.compare(
			    password,
			    user.password
		    );
            
			if (!validPassword) {
				return res.status(401).send({error: true, message: "Invalid Email or Password!" });
			}

			if (!user.verified) {
			    const url = `http://localhost:3000/users/${user.id}/verify`;
			    await sendConfirmationEmail({ username: user.email, text: url });
	
				return res.status(401).send({ error: true, message: "Email not verified. A verification email has been sent. Please check your inbox." });

		    }

			// res.status(200).send({ error: false, message: "logged in successfully" });
			setTimeout(() => {
				return res.status(200).send({ error: false, message: "Logged in successfully" });
			}, 1000);
		});
	} catch (error) {
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
});

export default router;
