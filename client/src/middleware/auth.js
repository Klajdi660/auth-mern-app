import { Navigate } from "react-router-dom";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
        return <Navigate to={"/"} replace={true}></Navigate>
    }

    return children;
};