import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import connection from "../models/db.js";
import sendConfirmationEmail from "../utils/sendEmail.js";

const usersRegister = async (req, res) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;
    
	const { error } = userModel.userValidate(req.body);
	
	if (error) {
		return res.status(400).send({ error: true, message: error.details[0].message });
	}

	try {
		connection.query('SELECT * FROM register WHERE email = ?', [email], async (error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).send({ error: true, message: "Internal Server Error" });
			}

			if (results.length > 0) {
				return res.status(400).send({ error: true, message: `User with this email "${email}" already exist. Please choose another email` });
			} else if (password !== passwordConfirm) {
				return res.status(400).send({ error: true, message: "Password and Confirm password not match"})
			}
        
			let hashPassword = await bcrypt.hash(password, 8);

		    connection.query("INSERT INTO register SET ?", {
				firstName: firstName,
				lastName: lastName,
				email: email,
			    password: hashPassword,
				// password: password
		    }, async (error, results) => {
			    if (error) {
				    console.error(error);
			    } 
		
				const url = `http://localhost:3000/users/${results.insertId}/verify`;
				const subject = "Verify email";
				await sendConfirmationEmail({ username: `${firstName} ${lastName}`, subject: subject, link: url });
		    });

		    res
			    .status(201)
			    .send({ error: false, message: "A message with a weblink has been sent to your email address. Please click that link to proceed." });
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
};

const userVerification = async (req, res) => {
    const { id } = req.params;
    
	try {
		connection.query(`SELECT * FROM register WHERE id = ?`, [id], (error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).send({ error: true, message: "Internal Server Error" });
			}
	
			const user = results[0];
	
			if (!user) {
				return res.status(400).send({ error: true, message: "Invalid link" });
			}
	
			connection.query(
				`UPDATE register SET verified = true WHERE id = ?`, [id], (err, results) => {
				  if (err) {
					console.error(err);
					return res.status(500).send({ error: true, message: "Internal Server Error" });
				  }
	
				  res.status(200).send({ error: false, message: "Email verified successfully" });
				}
			);
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
};

export const usersController = { usersRegister, userVerification };
