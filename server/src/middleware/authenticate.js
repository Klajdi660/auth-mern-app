import jwt from "jsonwebtoken";
import config from "config";
import dbConnection from "../helpers/db.js";
import createQuery from "../helpers/query.js";

const { access_token_secret } = config.get("jwt");

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const verifyToken = jwt.verify(token, access_token_secret);

        const query = "SELECT * FROM register WHERE id = ?";
        const result = await createQuery(dbConnection, query, [verifyToken.id]);
        const user = result[0];

        if (!user) {
            return res.status(401).json({ error: true, message: "User not found" });
        }

        req.token = token;
        req.user = user;
        req.userId = user.id;
            
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: true, message: "Unauthorized access"});
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: true, message: "Session expired try sign in"});
        }

        res.status(401).json({ error: true, message: "Invalid token" });
    }
};

export const localVariables = (req, res, next ) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
};

export const verifyUser = async (req, res, next) => {
    try {
        const { username, email } = req.method === "GET" ? req.query : req.body;
        const selectQuery = 'SELECT * FROM register WHERE email = ? OR username = ?';
        const selectValue = [email, username];

        const selectResult = await createQuery(dbConnection, selectQuery, selectValue);

        const existingUser = selectResult[0];
        if (existingUser.email !== email) {
            return { status: 400, error: true, message: `Can't find User with this email: "${email}"!` };
        } else if (existingUser.username !== username) {
            return { status: 400, error: true, message: `Can't find User with this username: "${username}"!` };
        }
        next();
    } catch (error) {
        return res.status(404).json({ error: true, message: "Authentication Error" });
    }
};