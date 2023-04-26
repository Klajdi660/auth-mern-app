import mysql from "mysql";
import config from "config";

const { host, user, password, database, waitForConnections, connectionLimit } = config.get("dbConfig");

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    // password: "",
    // database: "node-registration",
	waitForConnections: waitForConnections,
    connectionLimit: connectionLimit,
});

export default connection;
