import bcrypt from "bcrypt";
import dbConnection from "../helpers/db.js";
import createQuery from "../helpers/query.js";
import sendConfirmationEmail from "../helpers/mailer.js";
// import { tokenHelpers } from "../helpers/token.js";

// const { generateToken, decodeToken } = tokenHelpers;

const userRegister = async (firstName, lastName, email, username, password, passwordConfirm) => {
    try {
        const selectQuery = 'SELECT * FROM register WHERE email = ? OR username = ?';
        const selectValue = [email, username];

        const selectResult = await createQuery(dbConnection, selectQuery, selectValue);
        
        if (selectResult.length > 0) {
            const existingUser = selectResult[0];

            if (existingUser.email === email) {
                return { status: 400, error: true, message: `User with this email "${email}" already exists. Please choose another email` };
            } else if (existingUser.username === username) {
                return { status: 400, error: true, message: `User with this username "${username}" already exists. Please choose another username` };
            }
        } else if (password !== passwordConfirm) {
            return { status: 400, error: true, message: "Password and Confirm password not match" };
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const insertQuery = "INSERT INTO register SET ?";
        const insertValue = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: hashPassword,
        };
        
        const insertResult = await createQuery(dbConnection, insertQuery, insertValue);

        const userId = insertResult.insertId;
        // const expiration = Date.now() + 120000; // 120 seconds from now
        // const token = generateToken(userId, expiration);
        const url = `http://localhost:3000/user/${userId}/verify`;
        
        const subject = "Verify email";
        
        sendConfirmationEmail({ 
            name: `${firstName} ${lastName}`, 
            link: url,
            subject: subject
        });

        return { status: 201, error: false, message: "A message with a weblink has been sent to your email address. Please click that link to proceed." };
    } catch (error) {
        return { status: 401, error: true, message: "Internal server error" };
    }
};

const userVerification = async (id, token) => {
    const selectQuery = `SELECT * FROM register WHERE id = ?`;

    const selectResult = await createQuery(dbConnection, selectQuery, [id]);

    const user = selectResult[0];
    if (!user) {
        return { status: 400, error: true, message: "No user found" };
    }

    // Verify token and check expiration
    // const { userId, expiration } = decodeToken(token);
 
    // if (userId !== id) {
    //     return { status: 400, error: true, message: "Token does not match the user" };
    // }

    // if (expiration < Date.now()) {
    //     return { status: 400, error: true, message: "Token has expired" };
    // }

    // jwt.verify(token, ACCESS_TOKEN_SECRET, (error, decoded) => {
    //     console.log('decoded :>> ', decoded);
    // });

    const insertQuery = `UPDATE register SET verified = true WHERE id = ?`;

    const insertResult = await createQuery(dbConnection, insertQuery, [id]);
    
    return { status: 200, error: false, message: "Email verified successfully", data: insertResult };
};

export const userService = { userRegister, userVerification};