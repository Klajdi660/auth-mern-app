import mysql from "mysql";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Klajdi1996",
    database: "node-reg",
	waitForConnections: true,
    connectionLimit: 10,
})

export default connection;
