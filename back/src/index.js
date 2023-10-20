import express from "express";
import cors from "cors";
import config from "config";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import dbConnection from "./helpers/db.js";

const { port, prefix } = config.get("app");
const { cors_url } = config.get("cors")
const app = express();

// use express middleware for easier cookie handling
const corsOptions = {
    origin: cors_url,
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors());
app.use(cookieParser());
app.disable("x-powered-by"); // less hackers know about our stack

// need to be able to read body data
app.use(express.json()); // to support JSON-encoded boddies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded boddies

// api routes
app.use(`${prefix}/user`, userRoutes);
app.use(`${prefix}/auth`, authRoutes);

// port listening
app.listen(port, () => {
    console.log(`[Server]: Listening on port: ${port}`);
});
