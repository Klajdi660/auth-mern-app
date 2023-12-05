require("dotenv").config();
import express, { Express } from "express";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDb } from "./clients";
import { log } from "./utils";
import routes from "./routes";
import { deserializeUser } from "./middleware";
import { AppParams, CorsParams } from "./types";

const { port, prefix } = config.get<AppParams>("app");
const { cors_url } = config.get<CorsParams>("cors");

const app: Express = express();

// use express middleware for easier cookie handling
const corsOptions = {
    origin: cors_url,
    credentials: true
};

app.disable("x-powered-by"); // less hackers know about our stack
app.use(cors(corsOptions));
app.options("*", cors());
app.use(cookieParser());

// need to be able to read body data 
app.use(express.json({ limit: "10mb" })); // to support JSON-encoded boddies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded boddies

app.use(deserializeUser);

// start routes
app.use(routes);

// start server only when we have valid connection
const startServer = async () => {
    try {
        await connectToDb();
        app.listen(port, () => { 
            log.info(`[server]: ${JSON.stringify({ action: "Server Run", messsage: `Server is running at http://localhost:${port}` })}`);
        });
    } catch (error) {
        log.error(`[server]: ${JSON.stringify({ action: "Server Catch", messsage: "Cannot connect to the server", data: error })}`);
    }
};

startServer().catch((error) => {
    log.error(`[database]: ${JSON.stringify({ action: "Database Catch", messsage: "Invalid database connection", data: error })}`);
});
