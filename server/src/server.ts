require("dotenv").config();
import express, { Express, Request, Response, NextFunction } from "express";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDb } from "./clients";
import { log } from "./utils";
import routes from "./routes";
// import { deserializeUser } from "./middleware";
import { AppParams, CorsParams } from "./types";

const { port, prefix } = config.get<AppParams>("app");
const { cors_url } = config.get<CorsParams>("cors");

const app: Express = express();

// 1. Body parser 
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true })); 

// 2. Cookie parser
app.use(cookieParser());

// 3. Cors
const corsOptions = {
    origin: cors_url,
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors());

// 4. less hackers know about our stack
app.disable("x-powered-by");

// app.use(deserializeUser);

// 5. routes
app.use(routes);

// Unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

// Global Error Handler
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[errorHandler]: ${JSON.stringify({ action: "errorHandler", data: error })}`);
    if (res?.headersSent) return next(error);
    res?.json({ error: true, message: "Internal error" });
};
app.use(errorHandler);

// Start server only when we have valid connection
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
