import config from "config";
import jwt from "jsonwebtoken";
import { redisCLI } from "../clients";
import { log } from "./logger";

const { accessTokenExpiresIn, refreshTokenExpiresIn }= config.get<any>("token");

const signJWT = (
    payload: object,
    key: string,
    options = {}
) => {
    const privateKey = Buffer.from(
        config.get<string>(key),
        "base64"
    ).toString("ascii");

    return jwt.sign(
        payload,
        privateKey,
        {
            ...(options && options),
            algorithm: "HS256",
            allowInsecureKeySizes: true,
        }
    );
};

export const signToken = async (user: any) => {
    // Sign the access token
    const access_token = signJWT({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${accessTokenExpiresIn}m`,
    });

    // Sign the refresh token
    const refresh_token = signJWT({ sub: user.id }, "refreshTokenPrivateKey", {
        expiresIn: `${refreshTokenExpiresIn}m`
    });

    // Create a Session
    await redisCLI.setnx(`session_${user.id}`, JSON.stringify(user));
    await redisCLI.expire(`session_${user.id}`, 3600);
    
    return { access_token, refresh_token };
};

export const verifyJWT = (token: string, key: string) => {
    try {
        const publicKey = Buffer.from(
            config.get<string>(key), 
            "base64"
        ).toString("ascii");

        const decoded = jwt.verify(token, publicKey);
        
        return decoded;
    } catch (error) {
        log.error(`[verifyJWT]: ${JSON.stringify({ action: "verifyJWT catch", data: error })}`);
        return null;
    }
};
