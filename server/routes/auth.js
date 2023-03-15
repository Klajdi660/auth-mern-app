import express from "express";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import connection from "../db.js";
import { userModel } from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const { email, password } = req.body;
    
	try {
		const { error } = userModel.authValidate(req.body);

		if (error)
			return res.status(400).send({ message: error.details[0].message });

        connection.query('SELECT * FROM register WHERE email = ?', [email], async (err, results) => {
			const user = results[0];
			
			if (!user)
				return res.status(401).send({ message: "Invalid Email or Password" });

			const validPassword = await bcrypt.compare(
			    password,
			    user.password
		    );
            
			if (!validPassword)
			    return res.status(401).send({ message: "Invalid Email or Password" });

			if (!user.verified) {
			    const url = `http://localhost:3000/users/${user.id}/verify`;
			    await sendEmail(user.email, url);
	
			    return res
				    .status(400)
				    .send({ message: "An Email sent to your account please verify" });
		    }

			res.status(200).send({ message: "logged in successfully" });
		});
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

export default router;
