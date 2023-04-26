import express from "express";
import cors from "cors";
import config from "config";
import cookiParser from "cookie-parser";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const app = express();

const { port } = config.get("app");

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, 
};

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookiParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});