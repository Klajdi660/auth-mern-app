import jwt from "jsonwebtoken";
import connection from "../models/db.js";
import config from "config";

const { jwtSecret } = config.get("tokenConfig");

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        const verifyToken = jwt.verify(token, jwtSecret);
        
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
        console.erro(error);
        res.status(401).send({ error: true, message: "Unauthorized: No token provided" });
    }
};

export default authenticate;
