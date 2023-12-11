import { Op } from "sequelize";
import config from "config";
import crypto from "crypto";
import dayjs from "dayjs";
import otpGenerator from "otp-generator";
import { OtpSettings, UserTypesParams } from "../../types";
import { User, Session } from "../../models";
import { log, sendEmail, signAccessJWT } from "../../utils";
import { redisCLI } from "../../clients";

const { otpLength, otpConfig } = config.get<OtpSettings>("otp");

const getUserByEmail = async (email: string) => {
    return User.findOne({
        where: { email }
    }).catch((error) => {
        log.error(`[User]: ${JSON.stringify({ action: "getUserByEmail catch", data: error })}`);
    })
};

const getUserByEmailOrUsername = async (email: string, username: string) => {
    return User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    }).catch((error) => {
        log.error(`[User]: ${JSON.stringify({ action: "getUserByEmailOrUsername catch", data: error })}`);
    })
};

const createUser = async (data: UserTypesParams) => {
    const { email, username, firstName, lastName } = data;

    const extraData = {
        firstName, 
        lastName,
    };

    const newUser = new User({
        email,
        username,
        extra: JSON.stringify(extraData),
    });

    const saveUser = await newUser
        .save()
        .catch((error) => {
            log.error(`[User]: ${JSON.stringify({ action: "createUser catch", data: error })}`);
        });

    return saveUser;
};

const generateUniqueOTP = async (): Promise<string> => {
    const otp = otpGenerator.generate(otpLength, {
        ...otpConfig
    }); 

    return otp;
};

// Service for register user
export const registerUserHandler = async (data: UserTypesParams, email: string, username: string) => {
    // rechapta
    
    // agreed to terms
    if (!data.agreedToTerms) {
        return { error: true, message: "You must agree to the terms and conditions to register." };
    }

    // check user in database
    const existingUser: any = await getUserByEmailOrUsername(email, username);

    if (existingUser) {
        log.info(`[User]: ${JSON.stringify({ action: "createUser existingUser", data: existingUser })}`);
    
        return { error: true, message: "User with the provided email or username already exists" };
    }

    const user_registration: UserTypesParams = {
        ...data
    };

    // create radnom code to sent in email
    const otp = await generateUniqueOTP();

    // put code and expiredCodeAt in user_registration 
    user_registration["otpCode"] = otp;
    user_registration["expiredCodeAt"] = dayjs().add(60, 's');

    // put user in redis
    const temp_user = await redisCLI.get(email);
    if (!temp_user) {
        await redisCLI.setex(email, 60, 1);
    }    
    
    await redisCLI.setex(email, 3600, JSON.stringify(user_registration));

    // send otp code in user email
    const { firstName, lastName, otpCode } = user_registration;
    let subject = "OTP Verification Email";
    let templatePath= "OTP";
    const templateData = {
        title: subject,
        name: `${firstName} ${lastName}`,
        code: otpCode
    };
    
    const mail = await sendEmail(templatePath, templateData);

    return !mail 
        ? { error: true, message: "Error validating email" } 
        : { error: false, message: "A message with a code has been sent to your phone number. Please enter this code to proceed" };
};

// Service for confirm user
export const confirmUserHandler = async (code: string, email: string) => {
    const dataFromRedis: any = await redisCLI.get(email);
    const data: any = JSON.parse(dataFromRedis);

    if (!data) {
        return { error: true, message: "Confirmation time expired!" };
    }

    if (code !== data.otpCode) {
        return { error: true, message: "Confirmation code incorrect!" };
    }
    
    // check if otp code is expired
    const currentDateTime = dayjs();
    const expiresAtDateTime = dayjs(data.expiredCodeAt);
    const isExpired = currentDateTime.isAfter(expiresAtDateTime);

    if (isExpired) {
        log.error(`[confirmUser]: ${JSON.stringify({ action: "expired User", data: data })}`);
        return { error: true, message: "Your OTP code has expired. Please request a new OTP code" };
    }
    
    // insert user in database
    const user = await createUser(data);

    if (!user) {
        console.log(JSON.stringify({ action: "Confirm createUser Req", data: user }))
        return { error: true, message: "Failed to register user!" };
    }

    await redisCLI.del(email);

    return {
        error: false,
        message: "Congratulation! Your account has been created."
    }
};

// Create session (login user)
export const createSession = async ({ userId }: { userId: string }) => {
    return Session.create({ userId });
};

export const createSessionHandler = async (usernameOrEmail: string, password: string, username: string) => {
    // Find user with provided email
    const user: any = await getUserByEmailOrUsername(usernameOrEmail, usernameOrEmail);
    if (!user) {
        return { error: true, message: "User is not Registered with us, please SignUp to continue." };
    }

    const expectedPasssword = crypto
        .createHash("sha1")
        .update(password + username)
        .digest("hex");
        
    if(user.password !== expectedPasssword) {
        return { error: true, message: "Invalid Password! Please enter valid password." };
    }
    
    // create access token
    const accessToken = signAccessJWT(user);
    console.log('accessToken :>> ', accessToken);
    // create a refresh token 
    // const refreshToken = await signRefereshToken({ userId: user.id });
    // console.log('refreshToken :>> ', refreshToken);
    return {
        rToken: accessToken,
    }
};
