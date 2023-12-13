import config from "config";
import crypto from "crypto";
import dayjs from "dayjs";
import otpGenerator from "otp-generator";
import { Op } from "sequelize";
import { User } from "../../models";
import { log } from "../../utils";
import { OtpSettings, UserTypesParams } from "../../types";

const { otpLength, otpConfig } = config.get<OtpSettings>("otp");

export const getUserById = async (id: number) => {
    return User.findOne({
        where: { id }
    }).catch((error) => {
        log.error(`[User]: ${JSON.stringify({ action: "getUserByEmail catch", data: error })}`);
    })
};

export const getUserByEmail = async (email: string) => {
    return User.findOne({
        where: { email }
    }).catch((error) => {
        log.error(`[User]: ${JSON.stringify({ action: "getUserByEmail catch", data: error })}`);
    })
};

export const getUserByEmailOrUsername = async (email: string, username: string) => {
    return User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    }).catch((error) => {
        log.error(`[User]: ${JSON.stringify({ action: "getUserByEmailOrUsername catch", data: error })}`);
    })
};

export const createUser = async (data: UserTypesParams) => {
    const { email, username, firstName, lastName, password } = data;

    const extraData = {
        firstName, 
        lastName,
    };

    const newUser = new User({
        email,
        username,
        hash: password,
        extra: JSON.stringify(extraData),
    });

    const saveUser = await newUser
        .save()
        .catch((error) => {
            log.error(`[User]: ${JSON.stringify({ action: "createUser catch", data: error })}`);
        });

    return saveUser;
};


export const generateUniqueOTP = () => {
    const otp = otpGenerator.generate(otpLength, {
        ...otpConfig
    }); 

    return otp;
};
