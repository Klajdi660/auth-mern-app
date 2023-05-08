import mysql from "mysql";
import config from "config";

const { HOST, USER, PASSWORD, DATABASE, WAIT_FOR_CONNECTIONS, CONNECTION_LIMIT } = config.get("dbConfig");

const dbConnection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    // password: "",
    // database: "node-registration",
	waitForConnections: WAIT_FOR_CONNECTIONS,
    connectionLimit: CONNECTION_LIMIT,
});

dbConnection.connect((error) => {
    if (error) throw error;
    console.log("Database connected successfully");
});

export default dbConnection;
