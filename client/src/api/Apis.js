import { commonRequest } from "./ApiCall";
import { backend_url } from "./helper";

export const registerAPI = async (data) => {
    return await commonRequest("POST", `${backend_url}/user/register`, data);
};

export const loginAPI = async (data) => {
    return await commonRequest("POST", `${backend_url}/auth/login`, data);
};

export const resetPasswordAPI = async (data) => {
    return await commonRequest("POST", `${backend_url}/auth/sendPassword`, data)
};

export const logoutAPI = async (data) => {
    return await commonRequest("GET", `${backend_url}/auth/logout`, data);
};
