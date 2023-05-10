import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import sendConfirmationEmail from "./mailer.js";
import dbConnection from "../models/db.js";
import { userModel } from "../models/user.js";
import { tokenHelpers } from "../tokens/tokens.js";
import otpGenerator from "otp-generator";

const {  ACCESS_TOKEN_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES } = config.get("tokenConfig");
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = tokenHelpers;

let tokens = [];

const logIn = async (req, res) => {
    const { usernameOrEmail, password, remember } = req.body;

    const { error } = userModel.authValidate({ usernameOrEmail: usernameOrEmail, password: password });
    
    if (error) {
      return res.status(400).send({ error: true, message: error.details[0].message });
    }

    try {
        const query = "SELECT * FROM register WHERE username = ? OR email = ?";
        const values = [usernameOrEmail, usernameOrEmail];
        console.log('values111 :>> ', values);
        
        dbConnection.query(query, values, async (error, results) => {
            console.log('results111 :>> ', results);
           
            if (error) {
                return res.status(500).send({ error: true, message: "Error in querying the database" });
            }
  
            const user = results[0];
  
            if (!user) {
                return res.status(401).send({ error: true, message: "Invalid username/Email or Password!" });
            }
  
            const validPassword = await bcrypt.compare(password, user.password);
  
            if (!validPassword) {
                return res .status(401).send({ error: true, message: "Invalid username/Email or Password!" });
            }

            if (!user.verified) {
                const url = `http://localhost:3000/users/${user.id}/verify`;
                const subject = "Login email verification";
                await sendConfirmationEmail({
                    name: usernameOrEmail,
                    subject: subject,
                    link: url,
                });

                return res.status(401).send({ error: true, message: `Email ${usernameOrEmail} not verified. A verification email has been sent. Please check your inbox.` });
            }
          
            const id = user.id;

            // // 3. Create Refresh- and Accesstoken
            // const accessToken = createAccessToken(user.id);
            
            // const refreshToken = createRefreshToken(user.id);
            
            // // 4. Store Refreshtoken with user in "db"
            // // Could also use different version numbers instead.
            // // Then just increase the version number on the revoke endpoint
            // user.refreshToken = refreshToken;
        
            // // 5. Send token. Refreshtoken as a cookie and accesstoken as a regular response
            // sendRefreshToken(res, refreshToken);
            // sendAccessToken(res, req, accessToken);
          
            const token = jwt.sign({ id },  ACCESS_TOKEN_SECRET, {
                expiresIn: "2d"
            });
            
            // const cookieOptions = {
            //     // expires: new Date(
            //     //     Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000
            //     // ),
            //     // expires: new Date(Date.now() + 9000000),
            //     expires: remember ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 9000000),
            //     httpOnly: true
            // };
          
            const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // cookie will expire in 30 days if "remember me" is checked
            };
        
            // if (remember) {
            //     cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // cookie will expire in 30 days if "remember me" is checked
            // }
        
            res.cookie("userCookie", token, cookieOptions);
              
            const result = {
            	user,
            	token
            };
            // const validJson = JSON.stringify(userToken);
            // connection.query('UPDATE register SET tokens = ? WHERE id = ?', [validJson, user.id ]);
  
            res.status(201).send({ status: 201, error: false, message: "Logged in successfully", result });
        });
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal Server Error" });
    }
};

// const sendPasswordLink = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         res.status(401).send({ status: 401, message: "Enter Your Email" });
//     }

//     try {
//         dbConnection.query("SELECT * FROM register WHERE email=?", [email], async (error, results) => {
//             if (error) {
//                 return res.status(500).send({ error: true, message: "Error in querying the database"})
//             }
//             if (results.length === 0) {
//                 return res.status(401).send({
//                     error: true,
//                     message: `This email "${email}" doesn't exist. Please choose a valid email.`,
//                 });
//             }

//             const user = results[0];
            
//             // token generate for reset password
//             const token = jwt.sign({ id: user.id }, jwtSecret, {
//                 expiresIn: jwtExpiresIn,
//             });
            
//             dbConnection.query("UPDATE register SET tokens = ? WHERE id = ?", [
//                 token,
//                 user.id,
//             ]);

//             const url = `http://localhost:3000/users/forgotpassword/${user.id}/${token}`;
//             const subject = "Sending Email For password Reset";
//             const mail = await sendConfirmationEmail({
//                 username: user.email,
//                 subject: subject,
//                 link: url,
//             });

//             if (!mail) {
//                 return res.status(401).send({ error: true, message: "email not send" });
//             } else {
//                 res.status(201).send({ error: false, message: "A message with a weblink has been sent to your email address. Please click that link within 2 min to proceed with reset password." })
//             }
//         }
//         );
//     } catch (error) {
//         return res.status(500).json({ message: "Internal server error." });
//     }
// };
// let tokens = [];

const logOut = async (req, res) => {
    const token = req.token;
    tokens.push(token);
    tokens = tokens.filter((t) => t !== token)
   
    try {
        res.clearCookie("userCookie", {
            sameSite: "none",
            secure: true
        });

        res.status(201).send({status: 201, error: false, message: "User has been logged out."})
    } catch (error) {
        res.status(500).send({ error: true, message: "Internal server error" });
    }
};

const validUser = async (req, res) => {
    const userId = req.userId;
    
    try {
        dbConnection.query(`SELECT * FROM register WHERE id = ${userId}`, (error, result) => {
            const user = result[0];

            if (error) {
                return res.status(401).send({ error: true, message: "Error in querying the database" });
            } else {
                res.status(201).send({ status: 201, error: false, validUser: user });
            }
        });
    } catch (error) {
        res.status(401).send({ status: 401, error: true, message: "Internal server error" });
    }
};

const generateOTP = async (req, res) => {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
};

export const authController = { logIn, validUser, logOut, generateOTP };
