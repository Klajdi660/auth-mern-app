import express, { Express } from "express";
import config from "config";
import cors from "cors";

const { port, prefix } = config.get<{ port: number, prefix: string }>("app");

const app: Express = express();

app.disable("x-powered-by");
app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: "10mb" }));

app.listen(port, () => { 
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
