import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils";

const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = (req.headers.authorization || "").replace(
        /^Bearer\s/,
        ""
    );
    console.log('accessToken VV:>> ', accessToken);

    if (!accessToken) {
        console.log("HYRIIIIIIII 111111")
        return next();
    }
    console.log("HYRIIIII 22222")
    const decoded = verifyJWT(accessToken, "accessTokenPublicKey");
    console.log('decoded :>> ', decoded);
    if (decoded) {
        console.log("HYRIIIIII 333333")
        res.locals.user = decoded;
    }

    return next();
};

export default deserializeUser;
