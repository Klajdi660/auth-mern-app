import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "config";
import dbConnection from "../models/db.js";
import sendConfirmationEmail from "./mailer.js";
import { userModel } from "../models/user.js";

const {  ACCESS_TOKEN_SECRET } = config.get("tokenConfig");

const usersRegister = async (req, res) => {
    const { firstName, lastName, email, username, password, passwordConfirm, agreedToTerms } = req.body;
   
	const data = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		username: username,
		password: password,
		passwordConfirm: passwordConfirm
	};

	const { error } = userModel.userValidate(data);
	
	if (error) {
		return res.status(400).send({ error: true, message: error.details[0].message });
	}

    if (!agreedToTerms) {
		return res.status(400).json({ error: true, message: "You must agree to the terms and conditions to register." });
	}

	try {
		let selectQuery = 'SELECT * FROM register WHERE email = ? OR username = ?';
		let selectValues = [email, username];

		dbConnection.query(selectQuery, selectValues, async (error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).send({ error: true, message: "Internal Server Error" });
			}

			if (results.length > 0) {
				const existingUser = results[0];

				if (existingUser.email === email) {
                    return res.status(400).send({ error: true, message: `User with this email "${email}" already exists. Please choose another email` });
                } else if (existingUser.username === username) {
                    return res.status(400).send({ error: true, message: `User with this username "${username}" already exists. Please choose another username` });
                }
			} else if (password !== passwordConfirm) {
				return res.status(400).send({ error: true, message: "Password and Confirm password not match" });
			}

			let hashPassword = await bcrypt.hash(password, 8);
			let insertQuery = "INSERT INTO register SET ?";
			let insrValues = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				username: username,
			    password: hashPassword,
			};

		    dbConnection.query(insertQuery, insrValues, async (error, results) => {
				if (error) {
					return res.status(500).send({ error: true, message: "Error in querying the database" });
				}
     
				const hash = crypto.createHash("sha1").update(username + results.insertId).digest("hex");
				const userId = results.insertId;
                const token = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
				const url = `http://localhost:3000/users/${results.insertId}/verify?token=${token}`;
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
    const { token } = req.query;

	try {
		let selectQuery = `SELECT * FROM register WHERE id = ?`;

		dbConnection.query(selectQuery, [id], (error, results) => {
			if (error) {
                return res.status(500).send({ error: true, message: "Error in querying the database" });
            }
	
			const user = results[0];
	
			if (!user) {
				return res.status(400).send({ error: true, message: "Invalid link" });
			}

			jwt.verify(token, ACCESS_TOKEN_SECRET, (error, decoded) => {
				if (error) {
					return res.status(400).send({ error: true, message: "Invalid token" });
				}

				if (decoded.userId !== user.id) {
					return res.status(400).send({ error: true, message: "Token does not match the user" });
				}

				let insertQuery = `UPDATE register SET verified = true WHERE id = ?`;
	
				dbConnection.query(insertQuery, [id], (error, results) => {
					if (error) {
						return res.status(500).send({ error: true, message: "Error in querying the database" });
					}
		
					res.status(200).send({ error: false, message: "Email verified successfully" });
				});
			});
		});
	} catch (error) {
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
};

export const usersController = { usersRegister, userVerification };
