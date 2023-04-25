import mysql from "mysql";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "Klajdi1996",
    password: "",
    database: "node-registration",
    // database: "node-reg",
	waitForConnections: true,
    connectionLimit: 10,
});

export default connection;
