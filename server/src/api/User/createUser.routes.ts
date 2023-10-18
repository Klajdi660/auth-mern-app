import { Request, Response, Router } from "express";
import { asyncHandler } from "../../utils";
import validateResource from "../../middleware/validateResource";
import { creatUserSchema } from "../../schema/user.schema";
import { createUserHandler } from "./createUser";

const createUserRoutes = Router();

createUserRoutes.post(
    "/register",
    validateResource(creatUserSchema),
    asyncHandler(async (req: Request, res: Response) => {   
        const response = await createUserHandler(req.body);
        res.json(response);
    })
);

export default createUserRoutes;