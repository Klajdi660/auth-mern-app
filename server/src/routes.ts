import { Router } from "express";
import config from "config";
import { userRoutes } from "./api/User";
import { authRoutes } from "./api/Auth";
const { prefix } = config.get<{ prefix: string }>("app");

const routes = Router();

routes.use(`${prefix}/auth`, authRoutes)
// routes.use(`${prefix}/auth`, userRoutes);


export default routes;
