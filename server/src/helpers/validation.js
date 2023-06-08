import Joi from "joi";


const authValidate = (data) => {
    const schema = Joi.object({
        usernameOrEmail: Joi.string().required().label("Username/Email"),
        password: Joi.string().required().label("Password")
    });

    return schema.validate(data);
};

export const validation = { authValidate };