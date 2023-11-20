import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import otpGenerator from "otp-generator";
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
      return { 
        status: 400,
        error: true, 
        message: "Invalid username/Email or Password!" 
      };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return { 
        status: 400,
        error: true, 
        message: "Invalid username/Email or Password!" 
      };
    }

    if (!user.verified) {
      const url = `http://localhost:3000/user/${user.id}/verify`;
      const subject = "Login email verification";

      sendConfirmationEmail({
       name: usernameOrEmail, 
       link: url,
       subject: subject
      });
  
      return { 
        status: 400,
        error: true, 
        message: `Email ${usernameOrEmail} not verified. A verification email has been sent. Please check your inbox.` 
      };
    }

    const token = jwt.sign({ id: user.id }, access_token_secret, {
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

    return { 
      status: 200,
      error: false, 
      message: "Logged in successfully", 
      data: result 
    };
  } catch (error) {
    console.error(`Error: ${error}`);
    return { 
      status: 501, 
      error: true, 
      message: "Internal Server Error" 
    };
  }
};

const sendPasswordLink = async (email) => {
  try {
    const selectQuery = 'SELECT * FROM register WHERE email = ?';
    const selectValue = [email];

    const selectResult = await createQuery(dbConnection, selectQuery, selectValue);

    const userFind = selectResult[0];
    console.log('user :>> ', userFind.id);
    if (!userFind) {
      return { status: 401, error: true, message: "Invalid user" };
    }

    // token generate for reset password
    const token = jwt.sign({ id: userFind.id }, access_token_secret, {
      expiresIn: "120s"
    });

    const updateQuery = 'UPDATE register SET verifyToken = ? WHERE id = ?';
    const updateValue = [token, userFind.id];

    const updateResult = await createQuery(dbConnection, updateQuery, updateValue);

    console.log('updateResult :>> ', updateResult);

    return {error: false, message: "OK"};
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

const generateOTP = async (OTP) => {
  OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});

  return { error: false, message: "OTP code generate successfully!", code: OTP };
};

export const authService = { login, validUser, logOut, generateOTP, sendPasswordLink };
