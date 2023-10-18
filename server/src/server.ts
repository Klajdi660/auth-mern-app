import express, { Express } from "express";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDb } from "./clients/db";
import log from "./utils/logger";

const { port, prefix } = config.get<{ port: number, prefix: string }>("app");
const { cors_url } = config.get<{ cors_url: string }>("cors");

const app: Express = express();

// use express middleware for easier cookie handling
const corsOptions = {
    origin: cors_url,
    credentials: true
};

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.options("*", cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// start server only when we have valid connection
const startServer = async () => {
    try {
        await connectToDb();
        app.listen(port, () => { 
            log.info(`[server]: Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        log.error(`Cannot connect to the server: ${error}`);
    }
};

startServer().catch((error) => {
    log.error(`Invalid database connection: ${error}`);
});
