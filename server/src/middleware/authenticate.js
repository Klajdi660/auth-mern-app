import jwt from "jsonwebtoken";
import config from "config";
import dbConnection from "../helpers/db.js";
import createQuery from "../helpers/query.js";

const { access_token_secret } = config.get("jwt");

const authenticate = async (req, res, next) => {
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

export default authenticate;

// export const localVariables = (req, res, next ) => {
//     req.app.locals = {
//         OTP: null,
//         resetSession: false
//     }
//     next();
// };

// export const verifyUser = async (req, res, next) => {
//     try {
//         const { usernameOrEmail } = req.method == 'GET' ? req.query : req.body;

//         const query = "SELECT * FROM register WHERE username = ? OR email = ?";
//         const values = [usernameOrEmail, usernameOrEmail];

//         // check the user existence
//         dbConnection.query(query, [values], (error, results) => {
//             // if (results.length === 0) {
//             //     return res.status(404).send({ error: true, message: "Can't find user!" });
//             // }

//             next();
//         });
//     } catch (error) {
//         return res.status(500).send({ error: true, message: "Authentication Error" });
//     }
// };
