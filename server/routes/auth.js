import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import sendConfirmationEmail from "../utils/sendEmail.js";
import connection from "../db/db.js";
import { userModel } from "../models/user.js";

const { jwtSecret, jwtExpiresIn, jwtCookieExpires } = config.get("tokenConfig");

const router = express.Router();

// user Login
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const { error } = userModel.authValidate(req.body);

  if (error) {
    return res
      .status(400)
      .send({ error: true, message: error.details[0].message });
  }

  try {
    connection.query( "SELECT * FROM register WHERE email = ?", [email], async (err, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send({ error: true, message: "Internal Server Error" });
      }

      const user = results[0];

      if (!user) {
        return res
          .status(401)
          .send({ error: true, message: "Invalid Email or Password!" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(401)
          .send({ error: true, message: "Invalid Email or Password!" });
      }

      if (!user.verified) {
        const url = `http://localhost:3000/users/${user.id}/verify`;
        const subject = "Login email verification";
        await sendConfirmationEmail({
          username: user.email,
          subject: subject,
          link: url,
        });

        return res.status(401).send({
          error: true,
          message: `Email ${user.email} not verified. A verification email has been sent. Please check your inbox.`,
        });
      }
        
		  const id = user.id;
		
      const loginToken = jwt.sign({ id }, jwtSecret, {
        expiresIn: jwtExpiresIn
      });
		
      const cookieOptions = {
        expires: new Date(
          Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
		
		  res.cookie("usercookie", loginToken, cookieOptions);

      // const loginResults = {
      // 	user,
      // 	loginToken
      // };

      res
        .status(200)
        .send({ error: false, message: "Logged in successfully" , loginToken });
    });
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
});

router.post("/sendPasswordLink", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(401).send({ status: 401, message: "Enter Your Email" });
  }

  try {
    connection.query(
      "SELECT * FROM register WHERE email=?",
      [email],
      async (error, results) => {
        if (results.length === 0) {
          return res.status(401).send({
            error: true,
            message: `This email "${email}" doesn't exist. Please choose a valid email.`,
          });
        }

        const userFind = results[0];
        console.log("userFind :>> ", userFind);
        // token generate for reset password
        const token = jwt.sign({ id: userFind.id }, jwtSecret, {
          expiresIn: jwtExpiresIn,
        });
        console.log("token :>> ", token);

        connection.query("UPDATE register SET verifyToken = ? WHERE id = ?", [
          token,
          userFind.id,
        ]);

        const url = `http://localhost:3000/users/forgotpassword/${userFind.id}/${token}`;
        const subject = "Sending Email For password Reset";
        const mail = await sendConfirmationEmail({
          username: userFind.email,
          subject: subject,
          link: url,
        });

        if (!mail) {
          return res
            .status(401)
            .send({ error: true, message: "email not send" });
        } else {
			res.status(201).send({ error: false, message: "A message with a weblink has been sent to your email address. Please click that link within 2 min to proceed with reset password." })
        }

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
        // });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
