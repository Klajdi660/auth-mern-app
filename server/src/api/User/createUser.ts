import { Op } from "sequelize";
import { UserTypesParams } from "../../types/user.type";
import { User } from "../../models/Users";
import { log, sendEmail } from "../../utils";

const getUsersByEmailOrUsername = async (email: string, username: string) => {
    return User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    }).catch((error) => {
        log.error(`Error: ${error}`)
    })
};

const createUser = async (data: UserTypesParams) => {
    const { email, username, lastName, firstName } = data;

    const newUser = new User({
        email,
        username,
        firstName, 
        lastName,
        token: "1234abcd"
    });

    const saveUser = await newUser
        .save()
        .catch((error) => {
            log.error(`Error: ${error}`)
        });
    return saveUser;
};

export const createUserHandler = async (data: UserTypesParams) => {
    const { email, username } = data;

    // check user in database
    // const existingUser: any = await getUsersByEmailOrUsername(email, username);

    // if (existingUser) {
    //     if (existingUser.email === email && existingUser.username === username) {
    //         return { error: true, message: "Email and username already exist" };
    //     } else if (existingUser.email === email) {
    //         return { error: true, message: "Email already exists" };
    //     } else if (existingUser.username === username) {
    //         return { error: true, message: "Username already exists" };
    //     }
    // }

    // // insert user in database
    // const user = await createUser(data);
    // console.log('user :>> ', user);
    const mail = await sendEmail();
};
