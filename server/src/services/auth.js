import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import dbConnection from "../helpers/db.js";
import sendConfirmationEmail from "../helpers/mailer.js";

const {  access_token_secret, jwt_expires_in, jwt_cookie_expires } = config.get("jwt");

const login = async (usernameOrEmail, password) => {
  try {
    const query = "SELECT * FROM register WHERE username = ? OR email = ?";
    const values = [usernameOrEmail, password];

    const results = await new Promise((resolve, reject) => {
      dbConnection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const user = results[0];

    if (!user) {
      return { status: 401, error: true, message: "Invalid username/Email or Password!" };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return { status: 401, error: true, message: "Invalid username/Email or Password!" };
    }

    if (!user.verified) {
        sendConfirmationEmail(usernameOrEmail, user.id);
  
        return { status: 401, error: true, message: `Email ${usernameOrEmail} not verified. A verification email has been sent. Please check your inbox.` };
    }

    const id = user.id;

    const token = jwt.sign({ id }, access_token_secret, {
        expiresIn: jwt_expires_in
    });

    const cookieOptions = {
        httpOnly: true,
        expiresIn: jwt_cookie_expires
    };

    const result = {
      user,
      token,
      cookieOptions
    };

    return { status: 201, error: false, message: "Logged in successfully", result: result };
  } catch (error) {
    console.error("Error", error);
    return { status: 500, error: true, message: "Internal Server Error" };
  }
};

const validUser = async (userId) => {
    console.log('userId :>> ', userId);
    try {
        let query = `SELECT * FROM register WHERE id = ${userId}`;

        const results = await new Promise((resolve, reject) => {
            dbConnection.query(query, (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            });
        });

        const user = results[0];
        
        // dbConnection.query(query, (error, result) => {
        //     const user = result[0];

            if (!user) {
                return { status: 401, error: true, message: "No user found" };
            } else {
                return { status: 201, error: false, validUser: user };
            }
        // });
    } catch (error) {
        return { status: 401, error: true, message: "Internal server error" };
    }
};

export const authService = { login, validUser };
