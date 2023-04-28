import express from "express";
import cors from "cors";
import config from "config";
import cookiParser from "cookie-parser";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const { port } = config.get("app");

const app = express();

//  Use express middleware for easier cookie handling
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, 
};
app.use(cors(corsOptions));
app.use(cookiParser());

// Neede to be able to read body data
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded boddies

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});