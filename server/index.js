import express from "express";
import cors from "cors";
import config from "config";
import cookiParser from "cookie-parser";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const { PORT } = config.get("app");

const app = express();

//  Use express middleware for easier cookie handling
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookiParser());
app.disable('x-powered-by'); // less hackers know about our stack

// Neede to be able to read body data
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded boddies

// api routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
