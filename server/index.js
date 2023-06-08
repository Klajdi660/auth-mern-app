import express from "express";
import cors from "cors";
import config from "config";
import cookiParser from "cookie-parser";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const { port, prefix } = config.get("app");
const { cors_url } = config.get("cors");

const app = express();

//  Use express middleware for easier cookie handling
const corsOptions = {
    origin: cors_url,
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookiParser());
app.disable('x-powered-by'); // less hackers know about our stack

// Need to be able to read body data
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded boddies

// api routes
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/auth`, authRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
