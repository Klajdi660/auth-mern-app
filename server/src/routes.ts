import { Router } from "express";
import config from "config";
import { createUserRoutes } from "./api/User";

const { prefix } = config.get<{ prefix: string }>("app");

const routes = Router();

routes.use(`${prefix}/auth`, createUserRoutes);

export default routes;
