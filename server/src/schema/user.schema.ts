import { object, string, number, custom, TypeOf } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;

const isPasswordValid = (password: string): string[] => {
    const messages: string[] = [];
  
    const specialCharacterRegex = /[!@#$%^&*]/;
    const uppercaseRegex = /[A-Z]/;
  
    if (!specialCharacterRegex.test(password)) {
      messages.push("A special character is needed in the password.");
    }
  
    if (!uppercaseRegex.test(password)) {
      messages.push("The password should contain at least one capital letter.");
    }
  
    if (password.length < 6) {
      messages.push("The password should be at least 6 characters long.");
    }
  
    return messages;
};

export const createUserSchema = object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).regex(emailRegex, "Not a valid email"),
        username: string({
            required_error: "Username is required"
        }).regex(usernameRegex, "Username should only contain letters and numbers"),
        firstName: string({
            required_error: "First name is required",
        }),
        lastName: string({
            required_error: "Last name is required",
        }),
        password: string({
            required_error: "Password is required",
        }).refine((value) => {
            const passwordMessages = isPasswordValid(value);
            return passwordMessages.length === 0;
        }, {
            message: "Invalid password. See the specific requirements.",
        }),
        passwordConfirm: string({
            required_error: "Password confirmation is required",
        }),
        agreedToTerms: custom((value) => {
            return value === true;
        }, {
            message: "You must agree to the terms and conditions to register"
        }),
        // otpCode: number({
        //     required_error: "OTP code is required"
        // })
    }).refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
});

export const createSessionSchema = object({
    body: object({
        usernameOrEmail: string({
            required_error: "Username/Email is required",
        }),
        password: string({
            required_error: "Password is required",
        }),
    }),
});

export const otpCodeSchema = object({
    body: object({
        code: string({
            required_error: "OTP code is required",
        }),
        email: string(),
    }),
});

export type UserInput = TypeOf<typeof createUserSchema>["body"];
export type SessionInput = TypeOf<typeof createSessionSchema>["body"];
export type OtpCodeInput = TypeOf<typeof otpCodeSchema>["body"];
 