import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userValidate = (data) => {
	const regex = /[±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;]+/;

	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		username: Joi.string().pattern(regex, {
			name: "noSpecialChars",
			invert: true
		  }).required().label("Username"),
		password: passwordComplexity({
			min: 8,
			max: 50,
			uppercase: 1,
			symbols: 1,
			numbers: 0,
			spaces: 0,
			exclude: /[^\w\s]/,
			requirementCount: 2,
		}).required().label("Password"),
		passwordConfirm: passwordComplexity({
			min: 8,
			max: 50,
			uppercase: 1,
			symbols: 1,
			numbers: 0,
			spaces: 0,
			exclude: /[^\w\s]/,
			requirementCount: 2,
		}).required().label("Confirm Password"),

	});

	return schema.validate(data);
};

const authValidate = (data) => {
	const schema = Joi.object({
		usernameOrEmail: Joi.string().required().label("Username/Email"),
		password: Joi.string().required().label("Password"),
	});

	return schema.validate(data);
};

const authForgotPassword = (data) => {
	const schema = Joi.object({
		newPassword: passwordComplexity().required().label("New Password"),
		confirmNewPassword: passwordComplexity().required().label("Confirm new Password"),

	});
	
	return schema.validate(data);
};

export const userModel = { userValidate, authValidate, authForgotPassword };
