import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import dbConnection from "../helpers/db.js";
import sendConfirmationEmail from "../helpers/mailer.js";
import createQuery from "../helpers/query.js";

const {  access_token_secret, jwt_expires_in, jwt_cookie_expires } = config.get("jwt");

const login = async (usernameOrEmail, password) => {
  try {
    const query = "SELECT * FROM register WHERE username = ? OR email = ?";
    const value = [usernameOrEmail, password];

    const results = await createQuery(dbConnection, query, value);
    
    const user = results[0];

    if (!user) {
      return { status: 401, error: true, message: "Invalid username/Email or Password!" };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return { status: 401, error: true, message: "Invalid username/Email or Password!" };
    }

    if (!user.verified) {
      const url = `http://localhost:3000/user/${user.id}/verify`;
      const subject = "Login email verification";

      sendConfirmationEmail({
       name: usernameOrEmail, 
       link: url,
       subject: subject
      });
  
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

    return { status: 201, error: false, message: "Logged in successfully", data: result };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { status: 500, error: true, message: "Internal Server Error" };
  }
};

const validUser = async (userId) => {
  try {
    const query = `SELECT * FROM register WHERE id = ${userId}`;
  
    const result = await createQuery(dbConnection, query, [userId]);
  
    const user = result[0];
      
    if (!user) {
      return { status: 401, error: true, message: "No user found" };
    } else {
      return { status: 201, error: false, data: user };
    }
  } catch (error) {
    return { status: 401, error: true, message: "Internal server error" };
  }
};

const logOut = async () => {};

const generateOTP = async () => {};

export const authService = { login, validUser, logOut, generateOTP };
