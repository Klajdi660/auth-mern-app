import jwt from "jsonwebtoken";
import connection from "../models/db.js";
import config from "config";

const {  ACCESS_TOKEN_SECRET } = config.get("tokenConfig");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        // const token = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        const verifyToken = jwt.verify(token,  ACCESS_TOKEN_SECRET);
        
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

export const localVariables = (req, res, next ) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
};

export const verifyUser = async (req, res, next) => {
    try {
        const { username } = req.method == 'GET' ? req.query : req.body;

        // check the user existence
        connection.query('SELECT * FROM register WHERE email = ?', [username], (error, results) => {
            if (results.length === 0) {
                return res.status(404).send({ error: true, message: "Can't find user!" });
            }

            next();
        });
    } catch (error) {
        return res.status(500).send({ error: true, message: "Authentication Error" });
    }
};


// router.post('/login', (req, res) => {
//     const { email, username, password } = req.body;

//     if (!email && !username) {
//         return res.status(400).json({ error: 'Please provide either email or username.' });
//     }

//     let sql;
//     let param;
//     if (email) {
//         sql = 'SELECT * FROM users WHERE email = ?';
//         param = email;
//     } else {
//         sql = 'SELECT * FROM users WHERE username = ?';
//         param = username;
//     }

//     pool.query(sql, param, (error, results) => {
//         if (error) {
//             return res.status(500).json({ error: 'Internal server error.' });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({ error: 'User not found.' });
//         }

//         bcrypt.compare(password, results[0].password, (err, match) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Internal server error.' });
//             }

//             if (!match) {
//                 return res.status(401).json({ error: 'Incorrect password.' });
//             }

//             // User successfully authenticated, create and send JWT token here
//             res.json({ message: 'Successfully authenticated.' });
//         });
//     });
// });

// module.exports = router;
