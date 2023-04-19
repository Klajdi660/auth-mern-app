import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    password: Yup.string().required("*Please enter your password"),
    repeatPassword: Yup.string()
        .required("*Please repeat your password")
        .oneOf([Yup.ref("password")], "*Password doesn't match"),
    email: Yup.string()
        .email("*Please enter a valid email address")
        .required("*Please enter a valid email address"),
    firstName: Yup.string()
        .required("*Please enter your name")
        .matches(/^[A-Za-z]+$/, "*Characters not allowed"),
    lastName: Yup.string()
        .required("*Please enter your surname")
        .matches(/^[A-Za-z]+$/, "*Characters not allowed")
});

export default validationSchema;
