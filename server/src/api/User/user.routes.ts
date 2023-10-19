import { Request, Response, Router } from "express";
import { asyncHandler } from "../../utils";
import validateResource from "../../middleware/validateResource";
import { creatUserSchema, otpCodeSchema } from "../../schema/user.schema";
import { createUserHandler, sendOTPCodeHandler } from "./auth";

const userRoutes = Router();

// Route for sending OTP code to the user's email
userRoutes.post(
    "/sendOtp",
    validateResource(otpCodeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { email, firstName, lastName } = req.body;
        const response = await sendOTPCodeHandler(email, firstName, lastName);
        res.json(response);
    })
);

userRoutes.post(
    "/register",
    validateResource(creatUserSchema),
    asyncHandler(async (req: Request, res: Response) => {   
        const response = await createUserHandler(req.body);
        res.json(response);
    })
);

export default userRoutes;