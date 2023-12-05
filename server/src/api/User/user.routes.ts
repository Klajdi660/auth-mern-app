import { Request, Response, Router } from "express";
import { asyncHandler } from "../../utils";
import { validateResource } from "../../middleware";
import { createUserSchema, createSessionSchema, otpCodeSchema } from "../../schema";
import { createSessionHandler, createUserHandler, sendOTPCodeHandler } from "./auth";

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

// Route for sending OTP code to the user's email
userRoutes.post(
    "/sendotp",
    validateResource(otpCodeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { email, firstName, lastName } = req.body;
        const response = await sendOTPCodeHandler(email, firstName, lastName);
        res.json(response);
    })
);

// Route for creating user 
userRoutes.post(
    "/register",
    validateResource(createUserSchema),
    asyncHandler(async (req: Request, res: Response) => {   
        const response = await createUserHandler(req.body);
        res.json(response);
    })
);

export default userRoutes;