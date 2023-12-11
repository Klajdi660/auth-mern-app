import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils";

export const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = (req.headers.authorization || "").replace(
        /^Bearer\s/,
        ""
    );

    if (!accessToken) {
        return next();
    }

    const decoded = verifyJWT(accessToken, "accessTokenPublicKey");

    if (decoded) {
        res.locals.user = decoded;
    }

    return next();
};
