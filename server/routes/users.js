import express from "express";
import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import connection from "../db.js";
import sendConfirmationEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
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
				await sendConfirmationEmail({ username: `${firstName} ${lastName}`, text: url });
		    });

		    res
			    .status(201)
			    .send({ error: false, message: "A message with a weblink has been sent to your email address. Please click that link to proceed." });
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: true, message: "Internal Server Error" });
	}
});

router.get("/:id/verify", async (req, res) => {
	const { id } = req.params;
    
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
});

export default router;


// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//     // configure your email transporter here
// });

// Assuming you have a MySQL model called `userdb` for handling users

// router.post("/sendpasswordlink", (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         res.status(401).json({ status: 401, message: "Enter Your Email" });
//         return;
//     }

//     db.query("SELECT * FROM userdb WHERE email=?", [email], async (error, results) => {
//         if (error) {
//             res.status(500).json({ status: 500, message: "Internal Server Error" });
//             return;
//         }

//         if (results.length === 0) {
//             res.status(401).json({ status: 401, message: "invalid user" });
//             return;
//         }

//         const userfind = results[0];

//         // token generate for reset password
//         const token = jwt.sign({ _id: userfind._id }, keysecret, {
//             expiresIn: "120s"
//         });

//         db.query("UPDATE userdb SET verifytoken=? WHERE _id=?", [token, userfind._id], (error) => {
//             if (error) {
//                 res.status(500).json({ status: 500, message: "Internal Server Error" });
//                 return;
//             }

//             const mailOptions = {
//                 from: process.env.EMAIL,
//                 to: email,
//                 subject: "Sending Email For password Reset",
//                 text: `This Link Valid For 2 MINUTES http://localhost:3001/forgotpassword/${userfind.id}/${token}`
//             }

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log("error", error);
//                     res.status(401).json({ status: 401, message: "email not send" })
//                 } else {
//                     console.log("Email sent", info.response);
//                     res.status(201).json({ status: 201, message: "Email sent Successfully" })
//                 }
//             });
//         });
//     });
// });

