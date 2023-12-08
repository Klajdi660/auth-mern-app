export interface UserTypesParams {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm: string;
    agreedToTerms: boolean;
    otpCode?: string;
    expiredCodeAt?: any;
};

export interface smtpEmailTypesParams {
    service: string;
    host: string;
    port: number;
    secure: boolean;
    email: string;
    password: string;
};

// send otp routes
interface OtpConfig {
    lowerCaseAlphabets: boolean;
    upperCaseAlphabets: boolean;
    specialChars: boolean;
};

export interface OtpSettings {
    otpLength: number;
    otpConfig: OtpConfig;
}
