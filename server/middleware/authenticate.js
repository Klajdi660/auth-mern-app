import jwt from "jsonwebtoken";
import connection from "../models/db.js";
import config from "config";

const { jwtSecret } = config.get("tokenConfig");

const authenticate = async (req, res, next) => {
    // const authHeader = req.headers.authorization;

    try {
        const token = req.headers.authorization;
        console.log('token :>> ', token);
        
        const verifyToken = jwt.verify(token, jwtSecret);
        console.log('verifyToken :>> ', verifyToken);
        
        connection.query("SELECT * FROM register WHERE id = ?", [verifyToken.id], (error, result) => {
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
