import jwt from "jsonwebtoken";
import connection from "../models/db.js";
import config from "config";

const { jwtSecret } = config.get("tokenConfig");

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        const verifyToken = jwt.verify(token, jwtSecret);
        
        connection.query("SELECT * FROM register WHERE id = ?", [verifyToken.id], (err, result) => {
            const rootUser = result[0];

            if (!rootUser) {
                return res.status(401).send({ error: true, message: "User not found" });
            }

            req.token = token;
            req.rootUser = rootUser;
            console.log('req.rootUser :>> ', req.rootUser);
            req.userId = rootUser.id;
        });
    
        next();
    } catch (error) {
        res.status(401).send({ error: true, message: "Unauthorized: No token provided" });
    }
};

export default authenticate;
