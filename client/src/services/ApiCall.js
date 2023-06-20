import axios from "axios";

export const commonRequest = async (methods, url, body, header) => {
    let config = {
        method: methods,
        url,
        headers: header 
            ? header
            : {
                "Content-Type": "application/json"
            },
        data: body
    }

    return axios(config)
        .then((data) => {
            console.log('data :>> ', data);
            return data;
        })
        .catch((error) => {
            return error
        })
};