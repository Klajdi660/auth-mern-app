import express from "express";
import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import connection from "../db.js";
import sendConfirmationEmail from "../utils/sendEmail.js";

const router = express.Router();

// router.post("/", async (req, res) => {
// 	const { firstName, lastName, email, password } = req.body;
// 	try {
// 		const { error } = userModel.validate(req.body);

// 		if (error) {
// 			res.status(400).send({ message: error.details[0].message });
// 		} 
		
// 		connection.query("SELECT * FROM register WHERE email = ?", [email], (error, results) => {
// 			if (error) {
//                 console.log(error);
//             } else {
// 				if (results.length > 0) {
//                 res.json({
//                     status: 409,
//                     message: "User already exist"
//                 })
// 			}}
// 		});
        
// 	    const salt = await bcrypt.genSalt(10);
// 		const hashPassword = await bcrypt.hash(password, salt);

// 		connection.query("INSERT INTO register SET ?", {
// 			...req.body,
// 			password: hashPassword,
// 		}, async (error, results) => {
// 			if (error) {
// 				console.log(error);
// 			} 

// 			const url = `http://localhost:3000/users/${results.insertId}/verify`;
// 			await sendConfirmationEmail({ username: `${firstName} ${lastName}`, text: url });
// 		});

// 		res
// 			.status(201)
// 			.send({ message: "An Email sent to your account please verify" });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send({ message: "Internal Server Error" });
// 	}
// });

router.post("/", async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		connection.query('SELECT * from register WHERE email = ?', [email], async (err, results) => {
			const { error } = userModel.validate(req.body);

            if (error) {
			    res.status(400).send({ message: error.details[0].message });
		    } else {
				if (results.length > 0) {
                    // return res.json({
                    //     status: 409,
                    //     message: "User already exist"
                    // })
					return res.status(400).send({ message: "User already exist"});
				}
            }
        
			let hashPassword = await bcrypt.hash(password, 8);

		    connection.query("INSERT INTO register SET ?", {
			    ...req.body,
			    password: hashPassword,
		    }, async (error, results) => {
			    if (error) {
				    console.log(error);
			    } 
			
				const url = `http://localhost:3000/users/${results.insertId}/verify`;
				await sendConfirmationEmail({ username: `${firstName} ${lastName}`, text: url });
		    });

		    res
			    .status(201)
			    .send({ message: "An Email sent to your account please verify" });
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/:id/verify", async (req, res) => {
	const { id } = req.params;

	connection.query(`SELECT * FROM register WHERE id = ?`, [id], (error, results) => {
		if (error) {
			console.error(err);
		    return res.status(500).send({ message: "Internal Server Error" });
		}

		const user = results[0];

		if (!user) {
			return res.status(400).send({ message: "Invalid link" });
		}

		connection.query(
            `UPDATE register SET verified = true WHERE id = ?`, [id], (err, results) => {
              if (err) {
                console.error(err);
                return res.status(500).send({ message: "Internal Server Error" });
              }

              res.status(200).send({ message: "Email verified successfully" });
            }
        );
	});
});

export default router;
