import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import config from "config";
import sendConfirmationEmail from "../utils/sendEmail.js";
import connection from "../models/db.js";
import { userModel } from "../models/user.js";
import { tokenHelpers } from "../tokens/tokens.js";
// const { jwtSecret, jwtExpiresIn, jwtCookieExpires } = config.get("tokenConfig");
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = tokenHelpers;

const logIn = async (req, res) => {
    const { email, password } = req.body;

    const { error } = userModel.authValidate(req.body);
  
    if (error) {
      return res.status(400).send({ error: true, message: error.details[0].message });
    }
  
    try {
        connection.query( "SELECT * FROM register WHERE email = ?", [email], async (error, results) => {
            if (error) {
                return res.status(500).send({ error: true, message: "Error in querying the database" });
            }
  
            const user = results[0];
  
            if (!user) {
                return res.status(401).send({ error: true, message: "Invalid Email or Password!" });
            }
  
            const validPassword = await bcrypt.compare(password, user.password);
  
            if (!validPassword) {
                return res .status(401).send({ error: true, message: "Invalid Email or Password!" });
            }

            if (!user.verified) {
                const url = `http://localhost:3000/users/${user.id}/verify`;
                const subject = "Login email verification";
                await sendConfirmationEmail({
                    username: user.email,
                    subject: subject,
                    link: url,
                });

                return res.status(401).send({ error: true, message: `Email ${user.email} not verified. A verification email has been sent. Please check your inbox.` });
            }
          
            // const id = user.id;

            // 3. Create Refresh- and Accesstoken
            const accessToken = createAccessToken(user.id);
            console.log('accessToken :>> ', accessToken);
            const refreshToken = createRefreshToken(user.id);
            console.log('refreshToken :>> ', refreshToken);

            // 4. Store Refreshtoken with user in "db"
            // Could also use different version numbers instead.
            // Then just increase the version number on the revoke endpoint
            user.refreshToken = refreshToken;
            console.log('user.refreshToken :>> ', user.refreshToken);
            // 5. Send token. Refreshtoken as a cookie and accesstoken as a regular response
            sendRefreshToken(res, refreshToken);
            sendAccessToken(res, req, accessToken);
          
            // const userToken = jwt.sign({ id }, jwtSecret, {
            //     expiresIn: jwtExpiresIn
            // });

            // const cookieOptions = {
            //     // expires: new Date(
            //     //     Date.now() + jwtCookieExpires * 24 * 60 * 60 * 1000
            //     // ),
            //     expires: new Date(Date.now() + 9000000),
            //     httpOnly: true
            // };
          
            // res.cookie("userCookie", userToken, cookieOptions);
  
            // const loginResults = {
            // 	user,
            // 	loginToken
            // };
            // const validJson = JSON.stringify(userToken);
            // connection.query('UPDATE register SET tokens = ? WHERE id = ?', [validJson, user.id ]);
  
            // res.status(200).send({ error: false, message: "Logged in successfully" });
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
//         connection.query("SELECT * FROM register WHERE email=?", [email], async (error, results) => {
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
            
//             connection.query("UPDATE register SET tokens = ? WHERE id = ?", [
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

const logOut = async (req, res) => {
    console.log('req.user :>> ', req.user);
    const token = req.user.tokens;
    console.log('token :>> ', token);
    // const token = req.cookies.userCookie;
    // const userId = req.user.id;
    // console.log('userId :>> ', userId);
    // console.log('tokensssssss :>> ', token);
    // in mysql table tokens is JSON
    try {
        // const newTokens = token.filter(t => t);
        // const newTokens = req.cookies.userCookie.filter();
        // console.log('newTokens :>> ', newTokens);
        // token.filter((t) => t.token !== req.token);
        // JSON.stringify(req.user.tokens.filter((elem) => elem.token !== req.token))
        // connection.query('UPDATE register SET tokens = ? WHERE id = ?', [JSON.stringify(token.filter((t) => t.token !== req.token)), userId], (error, result) => {
        //     console.log('result :>> ', result);
        //     const user = result[0];
        //     console.log('user :>> ', user);
        //     if (!user) {
        //         return res.status(404).send({ error: true, message: "User not found" });
        //     }
    
        //     res.clearCookie("userCookie", { path: '/' });
        //     res.status(201).send({ status: 201, error: false, message: "Log out successfully!" });
        // });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal server error" });
    }
};

const validUser = async (req, res) => {
    const userId = req.userId;
    
    try {
        connection.query(`SELECT * FROM register WHERE id = ${userId}`, (error, result) => {
            const user = result[0];

            if (error) {
                return res.status(401).send({ error: true, message: "Error in querying the database" });
            } else {
                res.status(201).send({ status: 201, error: false, validUser: user });
            }
        });
    } catch (error) {
        res.status(401).send({ status: 401, error: true, message: "Internal server error"});
    }
};

export const authController = { logIn, validUser, logOut };
