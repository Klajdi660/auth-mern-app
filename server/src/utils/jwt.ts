import config from "config";
import jwt from "jsonwebtoken";
import { UserTypesParams } from "../types";
import { createSession } from "../api/User/auth";

const signJWT = (
    payload: object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
) => {
    const signingKey = Buffer.from(
        config.get<string>(keyName),
        "base64"
    ).toString("ascii");

    return jwt.sign(
        payload,
        signingKey,
        {
            ...(options && options),
            algorithm: "HS256",
        }
    );
};

// sign jwt
export const signAccessJWT = (user: UserTypesParams) => {
    const accessToken = signJWT(
        user, 
        "accessTokenPrivateKey",
        {
            expiresIn: "15m"
        }
    );

   return accessToken;
};

export const signRefereshToken = async ({ userId }: { userId: string }) => {
    const session = await createSession({
        userId,
    });
    console.log('session :>> ', session);
};

export const verifyJWT = <T>(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
    const publicKey = Buffer
        .from(
            config.get<string>(keyName),
            "base64"
        )
        .toString("ascii");
    
    try {
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (e) {
        return null;
    }
};