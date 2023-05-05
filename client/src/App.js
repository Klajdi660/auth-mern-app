import {
//   Route,
//   Routes,
//   Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main from "./components/Main/";
import Signup from "./components/Singup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";
import ForgotPassword from "./components/ForgotPassword";
import { AuthorizeUser } from "./middleware/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/dash",
    element: <AuthorizeUser><Main/></AuthorizeUser>
  },
  {
    path: "/register",
    element: <Signup/>
  },
  {
    path: "users/:id/verify",
    element: <EmailVerify/>
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword/>
  }
]);
const App = () => {
  // const user = localStorage.getItem("userToken");

  return (
    // <Routes>
    // 	{ user && <Route path="/" exact element={<Main />} /> }
    // 	<Route path="/signup" exact element={<Signup />} />
    // 	<Route path="/forgotPassword" exact element={<ForgotPassword/>}/>
    // 	<Route path="/login" exact element={<Login />} />
    // 	<Route path="/" element={<Navigate replace to="/login" />} />
    // 	<Route path="/users/:id/verify" element={<EmailVerify />} />
    // </Routes>
    <RouterProvider router={router}/>
  );
};

export default App;
