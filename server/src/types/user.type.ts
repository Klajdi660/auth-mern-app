export interface UserTypesParams {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm: string;
    agreedToTerms: boolean;
};

export interface smtpEmailTypesParams {
    service: string;
    host: string;
    port: number;
    secure: boolean;
    email: string;
    password: string;
};