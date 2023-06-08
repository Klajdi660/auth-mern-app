import mysql from "mysql";
import config from "config";

const { host, user, password, database } = config.get("db");

const dbConnection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    // password: "",
    // database: "node-registration",
	waitForConnections: true,
    connectionLimit: 10,
});

dbConnection.connect((error) => {
    if (error) throw error;
    console.log("Database connected successfully");
});

export default dbConnection;
