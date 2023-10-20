import { Op } from "sequelize";
import config from "config";
import crypto from "crypto";
import dayjs from "dayjs";
import otpGenerator from "otp-generator";
import { OtpSettings, UserTypesParams } from "../../types/user.type";
import { User } from "../../models/Users";
import { OTP } from "../../models/OTP";
import { log, sendEmail } from "../../utils";

const { otpLength, otpConfig } = config.get<OtpSettings>("otp");

const getUserByEmail = async (email: string) => {
    return User.findOne({
        where: { email }
    }).catch((error) => {
        log.error(`Error: ${error}`)
    })
};

const getUserByEmailOrUsername = async (email: string, username: string) => {
    return User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    }).catch((error) => {
        log.error(`Error: ${error}`);
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
            log.error(`Error: ${error}`);
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
            console.error(`Error: ${error}`)
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
   
    // insert user in database
    const user: any = await createUser(data, hashedPassword);

    return (!user) 
        ? { error: true, message: "User can't be created. Please try again." }
        : { error: false, message: "User registered successfully" };
};

// Create session (login user)
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
};
