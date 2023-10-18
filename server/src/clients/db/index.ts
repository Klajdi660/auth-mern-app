import config from "config";
import { Sequelize } from "sequelize";
import { log } from "../../utils/logger";

const { 
    host: dbHost, 
    user: dbUser, 
    password: dbPassword, 
    database: dbName 
} = config.get<{
    host: string,
    user: string,
    password: string,
    database: string
}>("mysql");

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
        log.info("[db]: Successfully connected to database");
    } catch (error) {
        log.error(`Failed to connect to database: ${error}`);
        return error;
    }
};

export { sequelizeConnection, connectToDb };
