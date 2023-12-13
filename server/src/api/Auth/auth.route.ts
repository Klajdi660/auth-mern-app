import { Router, Request, Response } from "express";
import { asyncHandler } from "../../utils";
import { validateResource } from "../../middleware";
import { createLoginSchema, createRegisterSchema, createOTPCodeSchema } from "../../schema";
import { loginHandler, registerHandler, confirmRegisterHandler, logoutHandler } from "./auth.controller";
import { accessTokenCookieOptions, refreshTokenCookieOptions, loginTokenCookieOptions } from "../../utils";

const authRouter = Router();

// Login user route
authRouter.post(
    "/login",
    validateResource(createLoginSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { usernameOrEmail, password } = req.body;
        const response = await loginHandler(usernameOrEmail, password, res);
        const { aToken, rToken } = response;
        res
            .cookie("access_token", aToken, accessTokenCookieOptions)
            .cookie("refresh_token", rToken, refreshTokenCookieOptions)
            .cookie("logged_in", true, loginTokenCookieOptions)
            .json(response);
    })
);

// Register user route 
authRouter.post(
    "/register",
    validateResource(createRegisterSchema),
    asyncHandler(async (req: Request, res: Response) => {   
        const response = await registerHandler(req.body);
        res.json(response);
    })
);

// Route for sending OTP code to the user's email
authRouter.post(
    "/confirm",
    validateResource(createOTPCodeSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { code, email } = req.body;
        const response = await confirmRegisterHandler(code, email);
        res.json(response);
    })
);

authRouter.post(
    "logout",
    asyncHandler(async (req: Request, res: Response) => {
        const user = res.locals.user;
        const response = await logoutHandler(user);

        res
            .cookie("access_token", "", { maxAge: 1 })
            .cookie("refresh_token", "", { maxAge: 1 })
            .cookie("logged_in", "", { maxAge: 1 })
            .json(response);
    })
);

export default authRouter;
