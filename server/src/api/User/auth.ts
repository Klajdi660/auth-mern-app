import { Op } from "sequelize";
import config from "config";
import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import otpGenerator from "otp-generator";
import { literal } from "sequelize";
import { OtpSettings, UserTypesParams } from "../../types";
import { User, OTP, Session } from "../../models";
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

    // const saveUser = await newUser
    //     .save()
    //     .catch((error) => {
    //         log.error(`[User]: ${JSON.stringify({ action: "createUser catch", data: error })}`);
    //     });
    const saveUser = "";
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
    // recaptcha

    // check user in database
    const existingUser: any = await getUserByEmailOrUsername(email, username);

    if (existingUser) {
        log.info(`[User]: ${JSON.stringify({ action: "createUser existingUser", data: existingUser })}`);
        if (existingUser.email === email && existingUser.username === username) {
            return { error: true, message: "Email and username already exist" };
        } else if (existingUser.email === email) {
            return { error: true, message: "Email already exists" };
        } else if (existingUser.username === username) {
            return { error: true, message: "Username already exists" };
        }
    }

    const user_registration: UserTypesParams = {
        ...data
    };

    // create radnom code to sent in email
    const otp = await generateUniqueOTP();

    // put code and expiredCodeAt in user_registration 
    user_registration["otpCode"] = otp;
    user_registration["expiredCodeAt"] = dayjs().add(60, 'second').toDate();

    // put user in redis
    const temp_user = await redisCLI.get(email);
    if (!temp_user) {
        await redisCLI.setex(email, 60, 1);
        console.log('HYRIII :>> ');
        console.log('temp_user 1:>> ', temp_user);
    }    
    
    await redisCLI.setex(email, 3600, JSON.stringify(user_registration));

    console.log('user_registration :>> ', user_registration);
    console.log('temp_user :>> ', temp_user);

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

    // find the most recent OTP code for email
    // const otpResp = await OTP.findOne({
    //     where: { email },
    //     order: [[`createdAt`, 'DESC']], // sorting order(from newest to oldest) so that the most recently created document appears first
    //     limit: 1, // set to just one document
    // }) as any;

    // if (!otpResp || otpCode !== +otpResp.otp) {
    //     return { error: true, message: "The OTP code is not valid" };
    // }

    // check if otp code is expired
    // dayjs.extend(utc);
    // const currentTimestamp = dayjs().utc();
    // const expiresAtTimestamp = dayjs(otpResp.expiresAt + "Z").utc();
    // const timeDifferenceMinutes = expiresAtTimestamp.diff(currentTimestamp, 'seconds');

    // if (timeDifferenceMinutes <= 0) {
    //     log.error(`[User]: ${JSON.stringify({ action: "expired User", data: timeDifferenceMinutes })}`);
    //     return { error: true, message: "Your OTP code has expired. Please request a new OTP code." };
    // }

    // // insert user in database
    // const user: any = await createUser(data, hashedPassword);

    // return (!user) 
    //     ? { error: true, message: "User can't be created. Please try again." }
    //     : { error: false, message: "User registered successfully." };
};

// Service for confirm user
export const confirmUserHandler = async (code: string, email: string) => {
    const dataFromRedis: any = await redisCLI.get(email);
    const data: any = JSON.parse(dataFromRedis);
    console.log('redis data :>> ', data);
    if (!data) {
        return { error: true, message: "Confirmation time expired!" };
    }

    // if (code !== data.otpCode) {
    //     return { error: true, message: "Confirmation code incorrect!" };
    // }

    // insert user in database
    const user = await createUser(data);

    // if (!user) {
    //     console.log(JSON.stringify({ action: "Confirm createUser Req", data: user }))
    //     return { error: true, message: "Failed to register user!" };
    // }

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
