import { Request, Response, Router } from "express";
import { asyncHandler } from "../../utils";
import { validateResource } from "../../middleware";
import { createUserSchema, createSessionSchema, otpCodeSchema } from "../../schema";
import { createSessionHandler, registerUserHandler, confirmUserHandler } from "./auth";

const userRoutes = Router();

// Route for creating session (user login)
userRoutes.post(
    "/sessions",
    validateResource(createSessionSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { usernameOrEmail, password, username } = req.body;
        const response = await createSessionHandler(usernameOrEmail, password, username);
        res.json(response);
    })
);

// Route for register user 
userRoutes.post(
    "/register",
    validateResource(createUserSchema),
    asyncHandler(async (req: Request, res: Response) => {   
        const { email, username } = req.body;
        const response = await registerUserHandler(req.body, email, username);
        res.json(response);
    })
);

// Route for sending OTP code to the user's email
userRoutes.post(
    "/confirm",
    validateResource(otpCodeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { code, email } = req.body;
        const response = await confirmUserHandler(code, email);
        res.json(response);
    })
);


export default userRoutes;