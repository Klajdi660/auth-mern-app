// import "dotenv/config"
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import config from "config";

const app = express();

const { port } = config.get("app");

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});