import axios from "axios";
// import https from "https";

export const axiosInstance = axios.create({
    // Disabling SSL certificate verification
    // httpsAgent: new https.Agent({
    //     rejectUnauthorized: false,
    // }),
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
        withCredentials: true 
    });
};