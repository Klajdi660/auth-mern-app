import { Request, Response, Router } from "express";
import { asyncHandler } from "../../utils";

const createUserRoutes = Router();

createUserRoutes.post(
    "/register",
    asyncHandler(async (req: Request, res: Response) => {
        const { firstName, lastName, email, username, password, passwordConfirm, agreedToTerms } = req.body;
        console.log('req.body :>> ', req.body);
        res.json(req.body);
    })
);

export default createUserRoutes;