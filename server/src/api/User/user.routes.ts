import { Request, Response, Router } from "express";
import { asyncHandler } from "../../utils";
import { validateResource } from "../../middleware";
import { createUserSchema } from "../../schema";
import { userHandler } from "./user.controller";

const userRoutes = Router();

// Route for register user 
userRoutes.post(
    "/user",
    validateResource(createUserSchema),
    asyncHandler(async (req: Request, res: Response) => {   
        const response = await userHandler(req.body);
        res.json(response);
    })
);

export default userRoutes;