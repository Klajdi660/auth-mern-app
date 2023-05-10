import jwt from "jsonwebtoken";
import dbConnection from "../models/db.js";
import config from "config";

const {  ACCESS_TOKEN_SECRET } = config.get("tokenConfig");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        // const token = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        const verifyToken = jwt.verify(token,  ACCESS_TOKEN_SECRET);
        
        dbConnection.query("SELECT * FROM register WHERE id = ?", [verifyToken.id], (error, result) => {
            if (error) {
                return res.status(500).send({ error: true, message: "Error in querying the database" });
            }

            const user = result[0];

            if (!user) {
                return res.status(401).send({ error: true, message: "User not found" });
            }

            req.token = token;
            req.user = user;
            req.userId = user.id;
            next();
        });
    } catch (error) {
        // console.error(error);
        // res.status(401).send({ error: true, message: "Unauthorized: No token provided" });
        if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ error: true, message: "Unauthorized access"});
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ error: true, message: "Session expired try sign in"});
        }

        res.status(401).send({ error: true, message: 'Invalid token' })
    }
};

export default authenticate;

export const localVariables = (req, res, next ) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
};

// export const verifyUser = async (req, res, next) => {
//     console.log('req.body :>> ', req.body);
//     try {
//         const { usernameOrEmail } = req.method == 'GET' ? req.query : req.body;
//         console.log('usernameOrEmail :>> ', usernameOrEmail);

//         const query = "SELECT * FROM register WHERE username = ? OR email = ?";
//         const values = [usernameOrEmail, usernameOrEmail];
//         console.log('values :>> ', values);
//         // check the user existence
//         dbConnection.query(query, [values], (error, results) => {
//             // if (results.length === 0) {
//             //     return res.status(404).send({ error: true, message: "Can't find user!" });
//             // }
//             console.log('results :>> ', results);

//             next();
//         });
//     } catch (error) {
//         return res.status(500).send({ error: true, message: "Authentication Error" });
//     }
// };
