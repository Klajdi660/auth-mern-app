import { endpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setLoading } from "../../slices/authSlice";
import { path } from "../../utils/paths";
import { toast } from "react-toastify";

const {
    SENDOTP_API
} = endpoints;

export const sendOtp = (email, navigate) => {
    return async (dispatch) => {
        // toast.promise("Loading.....")
        dispatch(setLoading(true));
  
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            });
            console.log("SENDOTP API RESPONSE............", response);
  
            // console.log(response.data.error);
  
            // if (!response.data.error) {
                //   throw new Error(response.data.message);
            // }
  
            console.log("OTP Sent Successfully");
            // navigate(path.verifyOTP);
        } catch (error) {
            console.log("SENDOTP API ERROR............", error);
        }
  
        dispatch(setLoading(false));
    };
};
