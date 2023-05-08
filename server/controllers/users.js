import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import dbConnection from "../models/db.js";
import sendConfirmationEmail from "./mailer.js";

const usersRegister = async (req, res) => {
    const { firstName, lastName, email, username, password, passwordConfirm, agreedToTerms } = req.body;
   
	const data = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		username: username,
		password: password,
		passwordConfirm: passwordConfirm
	}

	const { error } = userModel.userValidate(data);
	
	if (error) {
		return res.status(400).send({ error: true, message: error.details[0].message });
	}

    if (!agreedToTerms) {
		return res.status(400).json({ error: true, message: "You must agree to the terms and conditions to register." });
	}

	try {
		dbConnection.query('SELECT * FROM register WHERE email = ? OR username = ?', [email, username], async (error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).send({ error: true, message: "Internal Server Error" });
			}

			if (results.length > 0) {
				const existingUser = results[0];
				console.log('existingUser :>> ', existingUser);
				if (existingUser.email === email) {
                    return res.status(400).send({ error: true, message: `User with this email "${email}" already exists. Please choose another email` });
                } else if (existingUser.username === username) {
                    return res.status(400).send({ error: true, message: `User with this username "${username}" already exists. Please choose another username` });
                }
				// return res.status(400).send({ error: true, message: `User with this email "${email}" already exist. Please choose another email` });
			} else if (password !== passwordConfirm) {
				return res.status(400).send({ error: true, message: "Password and Confirm password not match"})
			}
        
			let hashPassword = await bcrypt.hash(password, 8);

		    dbConnection.query("INSERT INTO register SET ?", {
				firstName: firstName,
				lastName: lastName,
				email: email,
				username: username,
			    password: hashPassword,
				// password: password
		    }, async (error, results) => {
				if (error) {
					return res.status(500).send({ error: true, message: "Error in querying the database" });
				}

				const url = `http://localhost:3000/users/${results.insertId}/verify`;
				const subject = "Verify email";
				await sendConfirmationEmail({ name: `${firstName} ${lastName}`, subject: subject, link: url });
		    });

		    res
			    .status(201)
			    .send({ error: false, message: "A message with a weblink has been sent to your email address. Please click that link to proceed." });
		});
	} catch (error) {
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
};

const userVerification = async (req, res) => {
    const { id } = req.params;
    
	try {
		dbConnection.query(`SELECT * FROM register WHERE id = ?`, [id], (error, results) => {
			if (error) {
                return res.status(500).send({ error: true, message: "Error in querying the database" });
            }
	
			const user = results[0];
	
			if (!user) {
				return res.status(400).send({ error: true, message: "Invalid link" });
			}
	
			dbConnection.query(`UPDATE register SET verified = true WHERE id = ?`, [id], (error, results) => {
					if (error) {
						return res.status(500).send({ error: true, message: "Error in querying the database" });
					}
	
				  res.status(200).send({ error: false, message: "Email verified successfully" });
				}
			);
		});
	} catch (error) {
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
};

export const usersController = { usersRegister, userVerification };
