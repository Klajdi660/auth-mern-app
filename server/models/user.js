import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userValidate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		passwordConfirm: passwordComplexity().required().label("Confirm Password"),

	});
	return schema.validate(data);
};

const authValidate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

const authForgotPassword = (data) => {
	console.log(data)
	const schema = Joi.object({
		newPassword: passwordComplexity().required().label("New Password"),
		confirmNewPassword: passwordComplexity().required().label("Confirm new Password"),

	});
	return schema.validate(data);
};

export const userModel = { userValidate, authValidate, authForgotPassword };
