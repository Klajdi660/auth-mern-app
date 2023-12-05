import { Op } from "sequelize";
import config from "config";
import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import otpGenerator from "otp-generator";
import { OtpSettings, UserTypesParams } from "../../types";
import { User, OTP, Session } from "../../models";
import { log, sendEmail, signAccessJWT } from "../../utils";

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

const createUser = async (data: UserTypesParams, hashedPassword: string) => {
    const { email, username, lastName, firstName } = data;

    const newUser = new User({
        email,
        username,
        firstName, 
        lastName,
        password: hashedPassword
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

    const result = await OTP
        .findOne({ 
            where: { otp }
        })
        .catch((error) => {
            log.error(`[User]: ${JSON.stringify({ action: "OTP catch", data: error })}`);
        });

    if (result) {
        // If the generated OTP is not unique, try generating a new one
        return generateUniqueOTP();
    }

    return otp;
};

// Send OTP code for email verification
export const sendOTPCodeHandler = async (email: string, firstName: string, lastName: string) => {
    // check user in database
    const existingUser: any = await getUserByEmail(email);

    if (existingUser) {
        log.info(`[User]: ${JSON.stringify({ action: "sendOTPCode existingUser", data: existingUser })}`);
        return { error: true, message: "User already exists. Please sign in to continue." };
    }

    const otp = await generateUniqueOTP();

    // send otp code in user email
    let subject = "OTP Verification Email";
    let templatePath= "OTP";
    const templateData = {
        title: subject,
        name: `${firstName} ${lastName}`,
        code: otp
    };
    
    const otpPayload = { 
        email,
        otp,
    }
    const otpBody = await OTP.create(otpPayload);
    log.info(`Otp Body: ${JSON.stringify(otpBody)}`);

    if (!otpBody) {
        log.info(`[User]: ${JSON.stringify({ action: "OTP Req", data: otpBody })}`);
        return { error: true, message: "Something went wrong!" };
    }

    const mail = await sendEmail(templatePath, templateData);

    return !mail 
        ? { error: true, message: "Error validating email" } 
        : { error : false, message: "A message with a code has been sent to your email address" };
};

// Create user
export const createUserHandler = async (data: UserTypesParams) => {
    const { email, username, otpCode, password } = data;
    
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

    // hash password
    const hashedPassword = crypto
        .createHash("sha1")
        .update(password + username)
        .digest("hex");

    // find the most recent OTP code for email
    const otpResp = await OTP.findOne({
        where: { email },
        order: [[`createdAt`, 'DESC']], // sorting order(from newest to oldest) so that the most recently created document appears first
        limit: 1, // set to just one document
    }) as any;

    if (!otpResp || otpCode !== +otpResp.otp) {
        return { error: true, message: "The OTP code is not valid" };
    }

    // check if otp code is expired
    dayjs.extend(utc);
    const currentTimestamp = dayjs().utc();
    const expiresAtTimestamp = dayjs(otpResp.expiresAt + "Z").utc();
    const timeDifferenceMinutes = expiresAtTimestamp.diff(currentTimestamp, 'seconds');

    if (timeDifferenceMinutes <= 0) {
        log.error(`[User]: ${JSON.stringify({ action: "expired User", data: timeDifferenceMinutes })}`);
        return { error: true, message: "Your OTP code has expired. Please request a new OTP code." };
    }

    // insert user in database
    const user: any = await createUser(data, hashedPassword);

    return (!user) 
        ? { error: true, message: "User can't be created. Please try again." }
        : { error: false, message: "User registered successfully." };
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
