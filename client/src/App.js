import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthorizeUser } from "./middleware/auth";
import { path } from "./utils/paths";
import Main from "./components/Main/";
import Signup from "./components/Singup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import Error from "./components/Error";
import PasswordReset from "./components/PasswordReset/index.js";
import VerifyOTP from "./components/OTPVerify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: path.login,
    element: <Login/>
  },
  {
    path: path.dashboard,
    element: <AuthorizeUser><Main/></AuthorizeUser>
  },
  {
    path: path.register,
    element: <Signup/>
  },
  {
    path: path.emailVerify,
    element: <EmailVerify/>
  },
  {
    path: path.passwordReset,
    element: <PasswordReset/>
  },
  {
    path: path.verifyOTP,
    element: <VerifyOTP/>
  },
  {
    path: path.forgotPassword,
    element: <ForgotPassword/>
  },
  {
    path: path.error,
    element: <Error/>
  }
]);

const App = () => {
  return (
    <>
      {/* config toastify */}
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
      <RouterProvider router={router}/>
    </>
  );
};

export default App;
