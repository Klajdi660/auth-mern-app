import express from "express";
import bcrypt from "bcrypt";
import sendConfirmationEmail from "../utils/sendEmail.js";
import connection from "../db.js";
import { userModel } from "../models/user.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = "Klajd96@";

const router = express.Router();

router.post("/", async (req, res) => {
	const { email, password } = req.body;

	const { error } = userModel.authValidate(req.body);
    
	if (error) {
		return res.status(400).send({ error: true, message: error.details[0].message });
	}
    
	try {
        connection.query('SELECT * FROM register WHERE email = ?', [email], async (err, results) => {
			if (error) {
				console.error(error);
				return res.status(500).send({ error: true, message: "Internal Server Error" });
			}

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
	
				return res.status(401).send({ error: true, message: `Email ${user.email} not verified. A verification email has been sent. Please check your inbox.` });
		    }

			// const loginToken = user.generateA
			res.status(200).send({ error: false, message: "Logged in successfully" });
		});
	} catch (error) {
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
});
router.post('/forgotPassword', async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(401).send({ status: 401, message: "Enter Your Email" });
	}

	try {
		await connection.query("SELECT * FROM register WHERE email=?", [email], (error, results) => {
			if (results.length === 0) {
				return res.status(401).send({ error: true, message: `This email "${email}" doesn't exist. Please choose a valid email.` });
			}

			const userFind = results[0];
			console.log('userFind :>> ', userFind);
			// token generate for reset password
			const token = jwt.sign({ id: userFind.id} , JWT_SECRET, {
				expiresIn: "120s"
			});
			console.log('token :>> ', token);
		});
	
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
});

export default router;
