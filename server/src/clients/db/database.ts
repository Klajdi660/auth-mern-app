import config from "config";
import { Sequelize } from "sequelize";
import { log } from "../../utils/logger";
import { MysqlParams } from "../../types";

const { 
    host: dbHost, 
    user: dbUser, 
    password: dbPassword, 
    database: dbName 
} = config.get<MysqlParams>("mysql");

const dbDriver = "mysql";

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
    logging: false,
    define: {
        timestamps: false
    },
    query: {
        raw: true
    }
});

const connectToDb = async () => {
    try {
        await sequelizeConnection.authenticate();
        log.info(`[database]: ${JSON.stringify({ action: "Database Conn", messsage: "Successfully connected to database" })}`);
    } catch (error) {
        log.error(`[database]: ${JSON.stringify({ action: "Database Conn Catch", messsage: "Failed to connect to databaser", data: error })}`);
        return error;
    }
};

export { sequelizeConnection, connectToDb };
